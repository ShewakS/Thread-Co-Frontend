import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import { useStore, formatMoney } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

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
    updateUserProfile,
    offers
  } = useStore();

  const navigate = useNavigate();
  const savedAddresses = useMemo(() => currentUser?.addresses || [], [currentUser?.addresses]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(savedAddresses.length ? '0' : 'new');
  const [showNewAddressForm, setShowNewAddressForm] = useState(!savedAddresses.length);
  const [addressForm, setAddressForm] = useState({
    fullName: currentUser ? `${currentUser.firstname || ''} ${currentUser.lastname || ''}`.trim() : '',
    phone: currentUser?.phone || '',
    streetAddress: '',
    city: '',
    state: '',
    zip: ''
  });
  const [couponInput, setCouponInput] = useState(promoCode || '');
  const [couponNotice, setCouponNotice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPaying, setIsPaying] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!savedAddresses.length) {
      setSelectedAddressIndex('new');
      setShowNewAddressForm(true);
    } else if (selectedAddressIndex === 'new' && !showNewAddressForm) {
      setSelectedAddressIndex('0');
    }
  }, [savedAddresses.length, selectedAddressIndex, showNewAddressForm]);

  const getCustomerName = () => (
    addressForm.fullName.trim() ||
    `${currentUser?.firstname || ''} ${currentUser?.lastname || ''}`.trim() ||
    'Customer'
  );
  const getCustomerPhone = () => addressForm.phone.trim() || currentUser?.phone || '';

  const handleApplyCoupon = (event) => {
    event.preventDefault();
    setCouponNotice(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setPromoCode('');
      return;
    }

    const validOffer = offers.find((offer) => String(offer.code).toUpperCase() === code && offer.status === 'Active');
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

  const validateAddress = async () => {
    setNotice(null);

    if (!showNewAddressForm && selectedAddressIndex !== 'new' && savedAddresses[Number(selectedAddressIndex)]) {
      return savedAddresses[Number(selectedAddressIndex)];
    }

    if (!getCustomerName()) return setNotice({ type: 'error', text: 'Full Name is required.' }) || null;
    if (!getCustomerPhone() || getCustomerPhone().length < 10) {
      return setNotice({ type: 'error', text: 'Please enter a valid 10-digit Phone Number.' }) || null;
    }
    if (!addressForm.streetAddress.trim()) return setNotice({ type: 'error', text: 'Street Address is required.' }) || null;
    if (!addressForm.city.trim()) return setNotice({ type: 'error', text: 'City is required.' }) || null;
    if (!addressForm.state.trim()) return setNotice({ type: 'error', text: 'State is required.' }) || null;
    if (!/^\d{6}$/.test(addressForm.zip.trim())) {
      return setNotice({ type: 'error', text: 'Please enter a valid 6-digit Zip/Pin Code.' }) || null;
    }

    const fullAddress = `${addressForm.streetAddress}, ${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`;
    if (!savedAddresses.includes(fullAddress)) {
      await updateUserProfile({ addresses: [...savedAddresses, fullAddress] });
    }
    setShowNewAddressForm(false);
    return fullAddress;
  };

  const placeCodOrder = async (fullAddress) => {
    const newOrderId = await placeOrder(fullAddress, 'Cash on Delivery', { paymentStatus: 'COD' });
    if (newOrderId) {
      navigate('/order-success', { state: { orderId: newOrderId, total: orderTotal, paymentStatus: 'COD' } });
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
      customer: getCustomerName(),
      email: currentUser?.email,
      phone: getCustomerPhone(),
      preferredPayment: 'Razorpay'
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
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true
      },
      prefill: {
        name: getCustomerName(),
        email: currentUser?.email || '',
        contact: getCustomerPhone()
      },
      notes: { address: fullAddress },
      theme: { color: '#2f3e34' },
      handler: async (response) => {
        const verified = await verifyPayment({ paymentId, ...response });
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
              paymentId: response.razorpay_payment_id,
              paymentStatus: 'Paid'
            }
          });
        } else {
          setNotice({ type: 'error', text: 'Payment succeeded, but order creation failed. Please contact support.' });
        }
      },
      modal: { ondismiss: () => setIsPaying(false) }
    });

    razorpay.open();
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();
    const fullAddress = await validateAddress();
    if (!fullAddress) return;
    if (paymentMethod === 'cod') return placeCodOrder(fullAddress);
    return startRazorpayPayment(fullAddress);
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

        <div className="checkout-grid checkout-layout">
          <div className="checkout-main-column">
            <article className="content-block">
              <h3 className="checkout-section-title">
                <LocalShippingIcon color="secondary" /> 1. Shipping Address
              </h3>

              {savedAddresses.length > 0 && !showNewAddressForm ? (
                <div className="saved-address-list">
                  {savedAddresses.map((address, index) => (
                    <label className={`saved-address-option ${selectedAddressIndex === String(index) ? 'active' : ''}`} key={`${address}-${index}`}>
                      <input
                        type="radio"
                        name="saved-address"
                        checked={selectedAddressIndex === String(index)}
                        onChange={() => setSelectedAddressIndex(String(index))}
                      />
                      <span>{address}</span>
                    </label>
                  ))}
                </div>
              ) : null}

              <Button
                color="secondary"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedAddressIndex('new');
                  setShowNewAddressForm(true);
                }}
                style={{ borderRadius: '10px', marginBottom: showNewAddressForm ? '1rem' : 0 }}
              >
                Add New Address
              </Button>

              {showNewAddressForm ? (
                <form className="form-grid checkout-address-form" noValidate>
                  <div className="checkout-two-col">
                    <TextField label="Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))} required />
                    <TextField label="Phone Number" value={addressForm.phone} onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))} required placeholder="10-digit number" />
                  </div>
                  <TextField label="Street Address" value={addressForm.streetAddress} onChange={(e) => setAddressForm((prev) => ({ ...prev, streetAddress: e.target.value }))} required placeholder="Flat/House no., Colony/Street" />
                  <div className="checkout-three-col">
                    <TextField label="City" value={addressForm.city} onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))} required />
                    <TextField label="State" value={addressForm.state} onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))} required />
                    <TextField label="Zip / Pin Code" value={addressForm.zip} onChange={(e) => setAddressForm((prev) => ({ ...prev, zip: e.target.value }))} required placeholder="6 digits" />
                  </div>
                </form>
              ) : null}
            </article>

            <article className="content-block">
              <h3 className="checkout-section-title">2. Shipping Speed</h3>
              <TextField select label="Shipping Method" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} fullWidth>
                <MenuItem value="standard">Standard Shipping (free above order threshold)</MenuItem>
                <MenuItem value="express">Express Delivery</MenuItem>
                <MenuItem value="priority">Priority Same-Day Delivery</MenuItem>
              </TextField>
            </article>

            <article className="content-block">
              <h3 className="checkout-section-title">
                <CreditCardIcon color="secondary" /> 3. Payment Method
              </h3>
              <div className="payment-method-grid">
                {[
                  { id: 'razorpay', label: 'Razorpay', icon: <AccountBalanceWalletIcon /> },
                  { id: 'cod', label: 'Cash on Delivery', icon: <LocalShippingIcon /> }
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`payment-method-card ${paymentMethod === option.id ? 'active' : ''}`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="payment-note">
                {paymentMethod === 'cod'
                  ? <p><strong>Cash on Delivery:</strong> Payment status will be marked as COD until delivery collection.</p>
                  : <p>Pay securely with Razorpay using UPI, cards, netbanking, or wallets.</p>}
              </div>
            </article>
          </div>

          <div className="checkout-summary-column">
            <article className="content-block">
              <h3 style={{ margin: '0 0 1.5rem' }}>Order Summary</h3>

              <div className="checkout-items-list">
                {cart.map((item, index) => (
                  <div className="checkout-item-row" key={`${item.id}-${index}`}>
                    <div className="checkout-item-image">
                      <img src={resolveImage(item.image)} alt={item.name} />
                    </div>
                    <div className="checkout-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity} | Size: {item.size}</p>
                    </div>
                    <strong>{formatMoney(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: '1rem 0' }} />

              <form onSubmit={handleApplyCoupon} className="checkout-coupon-form">
                <input type="text" placeholder="PROMO CODE" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                <button type="submit">Apply</button>
              </form>

              {couponNotice && <Alert severity={couponNotice.type} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginBottom: '1.5rem' }}>{couponNotice.text}</Alert>}

              <div className="checkout-total-list">
                <div><span>Subtotal</span><strong>{formatMoney(cartSubtotal)}</strong></div>
                {promoState.discount > 0 && <div className="success-row"><span>Discount ({promoState.code})</span><strong>-{formatMoney(promoState.discount)}</strong></div>}
                <div><span>Shipping Fee ({shippingMethod.toUpperCase()})</span><strong>{shippingAmount === 0 ? 'FREE' : formatMoney(shippingAmount)}</strong></div>
                <hr />
                <div className="checkout-grand-total"><span>Total Amount</span><strong>{formatMoney(orderTotal)}</strong></div>
              </div>

              <Button color="secondary" variant="contained" onClick={handlePlaceOrder} disabled={isPaying} className="btn btn-block checkout-submit">
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
