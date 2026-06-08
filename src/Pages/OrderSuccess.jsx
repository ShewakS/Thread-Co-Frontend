import { useLocation, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatMoney } from '../Components/StoreContext';

const OrderSuccess = () => {
  const location = useLocation();
  
  // Extract state
  const { orderId, total, paymentStatus } = location.state || { orderId: `ORD-${Date.now().toString().slice(-6)}`, total: 0, paymentStatus: '' };

  return (
    <main className="section section-alt">
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <article className="content-block" style={{ textAlign: 'center', padding: '3.5rem 2rem', maxWidth: '580px', borderRadius: '24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.85)' }}>
          <CheckCircleIcon style={{ fontSize: '5rem', color: 'var(--success)', marginBottom: '1.5rem' }} />
          <h1 className="section-title" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem' }}>Order Placed!</h1>
          <p className="section-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Thank you for shopping with THREAD & CO.
          </p>

          <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: '16px', margin: '2rem 0', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.94rem' }}>
              <span className="muted" style={{ fontWeight: 600 }}>Order Reference:</span>
              <strong style={{ color: 'var(--black)' }}>{orderId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem' }}>
              <span className="muted" style={{ fontWeight: 600 }}>{paymentStatus === 'COD' ? 'Payment Status:' : 'Amount Paid:'}</span>
              <strong style={{ color: 'var(--black)' }}>{paymentStatus === 'COD' ? 'COD' : formatMoney(total)}</strong>
            </div>
            {paymentStatus === 'COD' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.94rem', marginTop: '0.8rem' }}>
                <span className="muted" style={{ fontWeight: 600 }}>Order Total:</span>
                <strong style={{ color: 'var(--black)' }}>{formatMoney(total)}</strong>
              </div>
            ) : null}
          </div>

          <p className="muted" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            A confirmation email has been dispatched to your registered address. We will update you once your parcel ships!
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button color="secondary" variant="contained" component={Link} to="/my-orders">
              Track Order
            </Button>
            <Button color="primary" variant="outlined" component={Link} to="/products" style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}>
              Continue Shopping
            </Button>
          </div>
        </article>
      </div>
    </main>
  );
};

export default OrderSuccess;
