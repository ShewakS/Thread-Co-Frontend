import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useStore, formatMoney } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const CartPage = () => {
  const {
    cart,
    cartSubtotal,
    removeCartItem,
    clearCart
  } = useStore();

  const navigate = useNavigate();
  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

  const checkout = () => {
    if (!cart.length) return;
    navigate('/checkout');
  };

  return (
    <main className="section section-alt cart-page">
      <section className="container">
        <div className="cart-hero card">
          <div className="cart-hero-copy">
            <p className="eyebrow">Shopping Cart</p>
            <h1 className="section-title">Review your selected items</h1>
            <p className="section-subtitle">Shipping and coupons are handled on the secure checkout page.</p>
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
                <p className="panel-subtitle muted">Check product quantities before moving to payment.</p>
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
                  <article className="cart-item cart-item-clean" key={`${item.id}-${index}`}>
                    <div className="cart-item-media">
                      <img src={resolveImage(item.image)} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h3 className="cart-item-title">{item.name}</h3>
                      <p className="cart-item-meta">{item.category || 'Product'}</p>
                      <p className="cart-item-meta">Size: {item.size || 'M'} | Color: {item.color || 'Standard'}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <span className="cart-qty-label">Qty</span>
                      <strong>{item.quantity}</strong>
                    </div>
                    <div className="cart-item-line-total">
                      <span className="cart-qty-label">Total</span>
                      <strong>{formatMoney(item.price * item.quantity)}</strong>
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

            <div className="summary-row summary-total">
              <span className="text-uppercase">Subtotal</span>
              <strong>{formatMoney(cartSubtotal)}</strong>
            </div>

            <Button color="secondary" variant="contained" className="btn btn-block" onClick={checkout}>Go to Payment</Button>
            <Button color="secondary" variant="outlined" className="btn btn-block" onClick={clearCart}>Clear Cart</Button>

            <p className="order-note muted small">
              Shipping method and coupon code can be selected during checkout.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
