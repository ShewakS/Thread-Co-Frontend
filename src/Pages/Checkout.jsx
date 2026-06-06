import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useStore, formatMoney } from '../Components/StoreContext';

const Checkout = () => {
  const {
    cart,
    cartSubtotal,
    promoCode,
    setPromoCode,
    promoState,
    shippingMethod,
    setShippingMethod,
    shippingAmount,
    orderTotal,
    placeOrder,
    createPaymentOrder,
    verifyPayment,
    currentUser,
    offers
  } = useStore();

  const navigate = useNavigate();

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: ''
  });

  // Coupon input state
  const [couponInput, setCouponInput] = useState(promoCode || '');
  const [couponNotice, setCouponNotice] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPaying, setIsPaying] = useState(false);

  // Validation errors
  const [notice, setNotice] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponNotice(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setPromoCode('');
      return;
    }

    // Validate promo code
    const validOffer = offers.find(o => String(o.code).toUpperCase() === code && o.status === 'Active');
    if (validOffer || code === 'SAVE10' || code === 'FREESHIP') {
      setPromoCode(code);
      setCouponNotice({ type: 'success', text: `Coupon "${code}" applied successfully!` });
    } else {
      setPromoCode('');
      setCouponNotice({ type: 'error', text: 'Invalid or expired coupon code.' });
    }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const validateAddress = () => {
    setNotice(null);

    if (!addressForm.fullName.trim()) {
      setNotice({ type: 'error', text: 'Full Name is required.' });
      return null;
    }
    if (!addressForm.phone.trim() || addressForm.phone.length < 10) {
      setNotice({ type: 'error', text: 'Please enter a valid 10-digit Phone Number.' });
      return null;
    }
    if (!addressForm.streetAddress.trim()) {
      setNotice({ type: 'error', text: 'Street Address is required.' });
      return null;
    }
    if (!addressForm.city.trim()) {
      setNotice({ type: 'error', text: 'City is required.' });
      return null;
    }
    if (!addressForm.state.trim()) {
      setNotice({ type: 'error', text: 'State is required.' });
      return null;
    }
    if (!addressForm.zip.trim() || !/^\d{6}$/.test(addressForm.zip.trim())) {
      setNotice({ type: 'error', text: 'Please enter a valid 6-digit Zip/Pin Code.' });
      return null;
    }

    return `${addressForm.streetAddress}, ${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`;
  };

  const placeCodOrder = async (fullAddress) => {
    const newOrderId = await placeOrder(fullAddress, 'Cash on Delivery', {
      paymentStatus: 'Pending'
    });
    if (newOrderId) {
      navigate('/order-success', { state: { orderId: newOrderId, total: orderTotal } });
    } else {
      setNotice({ type: 'error', text: 'Your bag is empty.' });
    }
  };

  const startRazorpayPayment = async (fullAddress) => {
    setIsPaying(true);
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setIsPaying(false);
      setNotice({ type: 'error', text: 'Unable to load Razorpay checkout. Please try again.' });
      return;
    }

    const paymentOrder = await createPaymentOrder({
      customer: addressForm.fullName,
      email: currentUser?.email,
      phone: addressForm.phone
    });

    if (!paymentOrder.ok) {
      setIsPaying(false);
      setNotice({ type: 'error', text: paymentOrder.message });
      return;
    }

    const { key, paymentId, order } = paymentOrder.data;
    const razorpay = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'THREAD & CO',
      description: 'Order payment',
      order_id: order.id,
      prefill: {
        name: addressForm.fullName,
        email: currentUser?.email || '',
        contact: addressForm.phone
      },
      notes: {
        address: fullAddress
      },
      theme: {
        color: '#111111'
      },
      handler: async (response) => {
        const verified = await verifyPayment({
          paymentId,
          ...response
        });

        if (!verified.ok) {
          setIsPaying(false);
          setNotice({ type: 'error', text: verified.message });
          return;
        }

        const newOrderId = await placeOrder(fullAddress, 'Razorpay', {
          paymentId,
          paymentStatus: 'Paid',
          razorpayPaymentId: response.razorpay_payment_id
        });

        setIsPaying(false);
        if (newOrderId) {
          navigate('/order-success', {
            state: {
              orderId: newOrderId,
              total: orderTotal,
              paymentId: response.razorpay_payment_id
            }
          });
        } else {
          setNotice({ type: 'error', text: 'Payment succeeded, but order creation failed. Please contact support.' });
        }
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
        }
      }
    });

    razorpay.open();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const fullAddress = validateAddress();
    if (!fullAddress) return;

    if (paymentMethod === 'cod') {
      await placeCodOrder(fullAddress);
      return;
    }

    await startRazorpayPayment(fullAddress);
  };

  if (cart.length === 0) {
    return (
      <main className="section section-alt">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3>Your bag is empty</h3>
          <p className="muted" style={{ marginBottom: '2rem' }}>You cannot proceed to checkout with an empty bag.</p>
          <Button color="secondary" variant="contained" component={Link} to="/products">
            Go Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="section section-alt">
      <div className="container">
        <header className="page-heading">
          <h1 className="section-title">Secure Checkout</h1>
          <p className="section-subtitle">Complete your purchase seamlessly.</p>
        </header>

        {notice && <Alert severity={notice.type} style={{ marginBottom: '1.5rem' }}>{notice.text}</Alert>}

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Checkout Steps Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Delivery Address Block */}
            <article className="content-block">
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LocalShippingIcon color="secondary" /> 1. Shipping Address
              </h3>
              <form className="form-grid" noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <TextField
                    label="Full Name"
                    value={addressForm.fullName}
                    onChange={e => setAddressForm(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Phone Number"
                    value={addressForm.phone}
                    onChange={e => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="10-digit number"
                  />
                </div>
                <TextField
                  label="Street Address"
                  value={addressForm.streetAddress}
                  onChange={e => setAddressForm(prev => ({ ...prev, streetAddress: e.target.value }))}
                  required
                  placeholder="Flat/House no., Colony/Street"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <TextField
                    label="City"
                    value={addressForm.city}
                    onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    required
                  />
                  <TextField
                    label="State"
                    value={addressForm.state}
                    onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                    required
                  />
                  <TextField
                    label="Zip / Pin Code"
                    value={addressForm.zip}
                    onChange={e => setAddressForm(prev => ({ ...prev, zip: e.target.value }))}
                    required
                    placeholder="6 digits"
                  />
                </div>
              </form>
            </article>

            {/* Shipping Method Block */}
            <article className="content-block">
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
                2. Shipping Speed
              </h3>
              <TextField
                select
                label="Shipping Method"
                value={shippingMethod}
                onChange={e => setShippingMethod(e.target.value)}
                fullWidth
              >
                <MenuItem value="standard">Standard Shipping (₹99 or FREE above ₹1000)</MenuItem>
                <MenuItem value="express">Express Delivery (₹149 - Delivered in 2 Days)</MenuItem>
                <MenuItem value="priority">Priority Same-Day Delivery (₹249)</MenuItem>
              </TextField>
            </article>

            {/* Payment Method Block */}
            <article className="content-block">
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCardIcon color="secondary" /> 3. Payment Method
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { id: 'razorpay', label: 'Razorpay', icon: <AccountBalanceWalletIcon /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <LocalShippingIcon /> }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    style={{
                      flex: 1,
                      padding: '1rem 0.5rem',
                      borderRadius: '12px',
                      border: paymentMethod === opt.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: paymentMethod === opt.id ? 'var(--accent-soft)' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.86rem',
                      color: 'var(--text)'
                    }}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Details */}
              {paymentMethod === 'cod' && (
                <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Pay with Cash/UPI at Delivery:</strong> You can pay directly to our delivery executive when your parcel arrives. No advance payment required.
                  </p>
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Pay securely with Razorpay using UPI, cards, netbanking, or wallets. You will be redirected to the Razorpay checkout window.
                  </p>
                </div>
              )}
            </article>
          </div>

          {/* Sidebar Summary Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '120px' }}>
            <article className="content-block">
              <h3 style={{ margin: '0 0 1.5rem' }}>Order Summary</h3>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '55px', borderRadius: '6px', overflow: 'hidden', background: '#eee', flexShrink: 0 }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Qty: {item.quantity} | Size: {item.size}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                      {formatMoney(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '1rem 0' }} />

              {/* Coupon Box */}
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    flexGrow: 1
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    border: 0,
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </form>

              {couponNotice && (
                <Alert severity={couponNotice.type} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginBottom: '1.5rem' }}>
                  {couponNotice.text}
                </Alert>
              )}

              {/* Calculation List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span style={{ color: 'var(--black)' }}>{formatMoney(cartSubtotal)}</span>
                </div>
                {promoState.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Discount ({promoState.code})</span>
                    <span>-{formatMoney(promoState.discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping Fee ({shippingMethod.toUpperCase()})</span>
                  <span style={{ color: 'var(--black)' }}>{shippingAmount === 0 ? 'FREE' : formatMoney(shippingAmount)}</span>
                </div>
                <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '0.5rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--black)' }}>
                  <span>Total Amount</span>
                  <span>{formatMoney(orderTotal)}</span>
                </div>
              </div>

              <Button
                color="secondary"
                variant="contained"
                onClick={handlePlaceOrder}
                disabled={isPaying}
                className="btn btn-block"
                style={{ marginTop: '1.5rem', padding: '0.8rem 1rem', fontSize: '0.94rem', borderRadius: '12px' }}
              >
                {isPaying ? 'Opening Payment...' : paymentMethod === 'cod' ? 'Confirm COD Order' : 'Go to Payment'}
              </Button>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
