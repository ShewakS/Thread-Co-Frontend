import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore, formatMoney, validators } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const CartPage = () => {
  const {
    cart,
    shippingMethod,
    promoCode,
    cartSubtotal,
    orderTotal,
    promoState,
    removeCartItem,
    clearCart,
    placeOrder,
    setPromoCode,
    setShippingMethod
  } = useStore();

  const [promoInput, setPromoInput] = useState(promoCode);
  const [notice, setNotice] = useState(null);

  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  const applyPromo = () => {
    if (promoInput && !validators.isValidPromo(promoInput)) return;
    setPromoCode(String(promoInput || '').trim().toUpperCase());
  };

  const checkout = async () => {
    if (!cart.length) return;
    const orderId = await placeOrder();
    if (orderId) setNotice('Order placed successfully.');
  };

  return (
    <main className="section section-alt cart-page">
      <section className="container">
        <div className="cart-hero card">
          <div className="cart-hero-copy">
            <p className="eyebrow">Shopping Cart</p>
            <h1 className="section-title">Review your selected items</h1>
            <p className="section-subtitle">A calm checkout layout styled to match the rest of the site.</p>
          </div>
          <div className="cart-hero-meta">
            <span className="muted">Items</span>
            <strong>{itemCount} {itemCount === 1 ? 'item' : 'items'}</strong>
          </div>
        </div>

        <div className="cart-layout cart-layout-mdb">
          <div className="cart-items-panel card card-panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">Shopping Cart</h2>
                <p className="panel-subtitle muted">Manage quantity and remove items before checkout.</p>
              </div>
              <Button color="secondary" variant="contained" className="btn" component={Link} to="/products">Back to Shop</Button>
            </div>

            <div className="cart-list-items">
              {!cart.length ? (
                <div className="cart-empty">
                  <p>Your cart is empty.</p>
                  <Button color="secondary" variant="contained" className="btn" component={Link} to="/products">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <article className="cart-item" key={`${item.id}-${index}`}>
                    <div className="cart-item-media">
                      <img src={resolveImage(item.image)} alt={item.name} />
                    </div>
                    <div>
                      <h3 className="cart-item-title">{item.name}</h3>
                      <p className="cart-item-meta">{item.category || 'Product'}</p>
                      <p className="cart-item-meta">Size: {item.size || 'M'} &nbsp;|&nbsp; Qty: {item.quantity}</p>
                      <p className="cart-item-price">{formatMoney(item.price * item.quantity)}</p>
                    </div>
                    <div className="cart-item-actions">
                      <Button color="secondary" variant="contained" className="btn" onClick={() => removeCartItem(index)}>Remove</Button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <aside className="cart-summary-panel card card-panel">
            <h3 className="panel-title">Summary</h3>
            <div className="summary-row">
              <span className="muted text-uppercase">Items</span>
              <strong>{itemCount} {itemCount === 1 ? 'item' : 'items'}</strong>
            </div>

            <div className="summary-row">
              <span className="muted text-uppercase">Subtotal</span>
              <strong>{formatMoney(cartSubtotal)}</strong>
            </div>

            <div className="summary-field">
              <label htmlFor="shippingSelect" className="muted text-uppercase">Shipping</label>
              <select id="shippingSelect" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                <option value="standard">Standard Delivery - Free over ₹1000</option>
                <option value="express">Express Delivery - ₹149</option>
                <option value="priority">Priority Delivery - ₹249</option>
              </select>
            </div>

            <div className="summary-field">
              <label htmlFor="promoCode" className="muted text-uppercase">Give code</label>
              <input
                id="promoCode"
                className="promo-input"
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter your code"
              />
              <Button color="secondary" variant="contained" className="btn" onClick={applyPromo}>Apply Code</Button>
            </div>

            <div className="summary-row">
              <span className="muted text-uppercase">Discount</span>
              <strong>{formatMoney(promoState.discount)}</strong>
            </div>

            <div className="summary-row summary-total">
              <span className="text-uppercase">Total price</span>
              <strong>{formatMoney(orderTotal)}</strong>
            </div>

            <Button color="secondary" variant="contained" className="btn btn-block" onClick={checkout}>Register</Button>
            <Button color="secondary" variant="outlined" className="btn btn-block" onClick={clearCart}>Clear Cart</Button>

            <p className="order-note muted small">
              Orders typically ship within 2 business days. Free shipping for orders over ₹1000.
            </p>
            {notice ? <Alert severity="success">{notice}</Alert> : null}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
