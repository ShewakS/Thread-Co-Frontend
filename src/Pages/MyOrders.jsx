import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStore, formatMoney } from '../Components/StoreContext';

const STATUS_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const MyOrders = () => {
  const { orders, currentUser } = useStore();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Filter orders for active user or show guest/all if mock
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    // Filter by name or email or show all if it matches sample data
    return orders.filter(
      (ord) => 
        String(ord.customer).toLowerCase() === String(currentUser.name).toLowerCase() || 
        String(ord.email).toLowerCase() === String(currentUser.email).toLowerCase() ||
        currentUser.role === 'admin' // Admins see everything or let them browse
    );
  }, [orders, currentUser]);

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.findIndex(step => String(step).toLowerCase() === String(status).toLowerCase());
  };

  return (
    <main className="section section-alt">
      <div className="container">
        <header className="page-heading">
          <h1 className="section-title">My Orders</h1>
          <p className="section-subtitle">Track your styling deliveries.</p>
        </header>

        {userOrders.length === 0 ? (
          <article className="content-block" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <LocalShippingOutlinedIcon style={{ fontSize: '4rem', color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1.5rem' }} />
            <h3>No Orders Found</h3>
            <p className="muted" style={{ marginBottom: '2rem' }}>
              Looks like you haven't placed any orders yet. Begin exploring our fresh collection!
            </p>
            <Button color="secondary" variant="contained" component={Link} to="/products">
              Start Shopping
            </Button>
          </article>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '820px', margin: '0 auto' }}>
            {userOrders.map((order) => {
              const currentStepIdx = getStepIndex(order.status === 'Completed' ? 'Delivered' : order.status);
              const isExpanded = expandedOrderId === order.id;

              return (
                <article key={order.id} className="content-block" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* Order Main Row */}
                  <div 
                    onClick={() => toggleExpand(order.id)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      cursor: 'pointer',
                      background: isExpanded ? 'var(--bg-muted)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                        ORDER REF
                      </span>
                      <strong style={{ color: 'var(--black)' }}>{order.id}</strong>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                        PLACED ON
                      </span>
                      <span style={{ fontWeight: 600 }}>{order.date || '2026-06-02'}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                        TOTAL AMOUNT
                      </span>
                      <strong style={{ color: 'var(--black)' }}>{formatMoney(order.total)}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                          STATUS
                        </span>
                        <span 
                          className="eyebrow" 
                          style={{
                            background: order.status === 'Cancelled' ? '#fbe9e8' : 'var(--accent-soft)',
                            color: order.status === 'Cancelled' ? 'var(--danger)' : 'var(--accent)',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.65rem'
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      
                      <button style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: '#fff' }}>
                      {/* Products List in Order */}
                      <h4 style={{ margin: '0 0 1rem' }}>Garments Ordered</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                        {(order.items || []).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', borderBottom: '1px solid #f6f6ef', paddingBottom: '0.5rem' }}>
                            <div>
                              <strong>{item.name}</strong> 
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.5rem' }}>
                                (Size: {item.size || 'M'} | Color: {item.color || 'Standard'})
                              </span>
                            </div>
                            <span style={{ color: 'var(--text-muted)' }}>
                              {item.quantity} x {formatMoney(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Info */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem' }}>Delivery Address</h4>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            {order.address}
                          </p>
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem' }}>Payment Summary</h4>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                            Method: {order.paymentMethod || 'Cash on Delivery'}
                          </p>
                        </div>
                      </div>

                      {/* Progress Milestones (Stepper) */}
                      {order.status !== 'Cancelled' ? (
                        <div>
                          <h4 style={{ margin: '0 0 1.5rem' }}>Delivery Tracking</h4>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 1rem', overflowX: 'auto' }}>
                            {/* Stepper horizontal progress line */}
                            <div 
                              style={{
                                position: 'absolute',
                                top: '18px',
                                left: '4%',
                                right: '4%',
                                height: '4px',
                                background: 'var(--border)',
                                zIndex: 1
                              }}
                            />
                            {/* Active stepper line overlay */}
                            {currentStepIdx >= 0 && (
                              <div 
                                style={{
                                  position: 'absolute',
                                  top: '18px',
                                  left: '4%',
                                  width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 92}%`,
                                  height: '4px',
                                  background: 'var(--accent)',
                                  zIndex: 1,
                                  transition: 'width 0.4s'
                                }}
                              />
                            )}

                            {STATUS_STEPS.map((step, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isActive = idx === currentStepIdx;

                              return (
                                <div 
                                  key={step} 
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    zIndex: 2,
                                    position: 'relative'
                                  }}
                                >
                                  <div 
                                    style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '50%',
                                      background: isActive ? 'var(--accent)' : isCompleted ? 'var(--accent)' : '#fff',
                                      border: isCompleted ? '0' : '2px solid var(--border)',
                                      display: 'grid',
                                      placeItems: 'center',
                                      color: isCompleted ? '#fff' : 'var(--text-muted)',
                                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    {isCompleted ? <CheckCircleIcon fontSize="small" /> : idx + 1}
                                  </div>
                                  <span 
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: isCompleted ? 700 : 500,
                                      color: isCompleted ? 'var(--black)' : 'var(--text-muted)'
                                    }}
                                  >
                                    {step}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '1rem', background: '#fbe9e8', color: 'var(--danger)', borderRadius: '10px', fontWeight: 600, textAlign: 'center' }}>
                          This order has been cancelled.
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
