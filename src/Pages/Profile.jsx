import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useStore, formatMoney } from '../Components/StoreContext';

const Profile = () => {
  const { currentUser, updateUserProfile, logout, orders } = useStore();
  const navigate = useNavigate();

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const STATUS_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter(
      (ord) => 
        String(ord.customer).toLowerCase() === String(currentUser.name).toLowerCase() || 
        String(ord.email).toLowerCase() === String(currentUser.email).toLowerCase() ||
        currentUser.role === 'admin'
    );
  }, [orders, currentUser]);

  const toggleExpand = (id) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const getStepIndex = (status) => {
    return STATUS_STEPS.findIndex(step => String(step).toLowerCase() === String(status).toLowerCase());
  };

  // Edit form states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || ''
  });
  
  // Address list states
  const [addresses, setAddresses] = useState(currentUser?.addresses || [
    '123 Park Street, Sector 5, Kolkata, WB - 700091',
    'Suite 404, Link Plaza, Bandra West, Mumbai, MH - 400050'
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const [notice, setNotice] = useState(null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setNotice(null);
    if (!editForm.name.trim()) return setNotice({ type: 'error', text: 'Name cannot be blank.' });
    
    updateUserProfile(editForm);
    setIsEditing(false);
    setNotice({ type: 'success', text: 'Profile details updated successfully.' });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    const updatedAddresses = [...addresses, newAddress.trim()];
    setAddresses(updatedAddresses);
    updateUserProfile({ addresses: updatedAddresses });
    setNewAddress('');
    setShowAddAddress(false);
    setNotice({ type: 'success', text: 'New shipping address added.' });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, idx) => idx !== index);
    setAddresses(updatedAddresses);
    updateUserProfile({ addresses: updatedAddresses });
    setNotice({ type: 'info', text: 'Address removed.' });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return (
      <main className="section section-alt">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <p>Please log in to view your profile.</p>
          <Button color="secondary" variant="contained" onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="section section-alt">
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <header className="page-heading">
          <h1 className="section-title">My Account</h1>
          <p className="section-subtitle">Manage your personal settings and addresses.</p>
        </header>

        {notice && <Alert severity={notice.type} style={{ marginBottom: '1.5rem' }}>{notice.text}</Alert>}

        <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* User Info & Actions Block */}
          <article className="content-block" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <AccountCircleOutlinedIcon style={{ fontSize: '6.5rem', color: 'var(--text-muted)' }} />
            </div>
            
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                <h2 style={{ margin: 0, fontSize: '1.45rem' }}>{currentUser.name}</h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{currentUser.email}</p>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Phone: {currentUser.phone || 'Not Specified'}
                </p>
                
                <Button 
                  color="secondary" 
                  variant="outlined" 
                  onClick={() => setIsEditing(true)}
                  startIcon={<EditIcon />}
                  style={{ marginTop: '1rem', borderRadius: '10px' }}
                >
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleEditSubmit} className="form-grid" style={{ width: '100%', textAlign: 'left' }}>
                <TextField
                  label="Full Name"
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                  required
                />
                <TextField
                  label="Phone Number"
                  value={editForm.phone}
                  onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Button color="secondary" variant="contained" type="submit" style={{ flex: 1 }}>
                    Save
                  </Button>
                  <Button color="inherit" variant="outlined" onClick={() => setIsEditing(false)} style={{ flex: 1 }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <hr style={{ border: 0, borderBottom: '1px solid var(--border)', width: '100%', margin: '0.5rem 0' }} />

            <Button 
              color="error" 
              variant="contained" 
              onClick={handleLogout}
              className="btn btn-block btn-danger"
              style={{ borderRadius: '10px' }}
            >
              Sign Out
            </Button>
          </article>

          {/* Saved Addresses Block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <article className="content-block" style={{ padding: '1.5rem' }}>
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HomeOutlinedIcon color="secondary" /> Shipping Addresses
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {addresses.map((addr, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', color: 'var(--text)', lineHeight: '1.4' }}>{addr}</span>
                    <button 
                      onClick={() => handleDeleteAddress(idx)}
                      style={{
                        border: 0,
                        background: 'transparent',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.82rem'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {!showAddAddress ? (
                <Button 
                  color="secondary" 
                  variant="outlined" 
                  onClick={() => setShowAddAddress(true)}
                  style={{ borderRadius: '10px' }}
                >
                  Add New Address
                </Button>
              ) : (
                <form onSubmit={handleAddAddress} className="form-grid">
                  <TextField
                    label="Address"
                    placeholder="Enter complete shipping address details"
                    value={newAddress}
                    onChange={e => setNewAddress(e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                    required
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Button color="secondary" variant="contained" type="submit">
                      Add
                    </Button>
                    <Button color="inherit" variant="outlined" onClick={() => setShowAddAddress(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </article>
          </div>

        </div>

        {/* Orders Block */}
        <article className="content-block" style={{ padding: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LocalShippingOutlinedIcon color="secondary" /> My Orders
          </h3>
          
          {userOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p className="muted" style={{ marginBottom: '1rem' }}>
                Looks like you haven't placed any orders yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {userOrders.map((order) => {
                const currentStepIdx = getStepIndex(order.status === 'Completed' ? 'Delivered' : order.status);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <article key={order.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg)' }}>
                    {/* Order Main Row */}
                    <div 
                      onClick={() => toggleExpand(order.id)}
                      style={{
                        padding: '1rem 1.25rem',
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
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                          ORDER REF
                        </span>
                        <strong style={{ color: 'var(--black)', fontSize: '0.9rem' }}>{order.id}</strong>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                          PLACED ON
                        </span>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{order.date || '2026-06-02'}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                          TOTAL AMOUNT
                        </span>
                        <strong style={{ color: 'var(--black)', fontSize: '0.9rem' }}>{formatMoney(order.total)}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', fontWeight: 700 }}>
                            STATUS
                          </span>
                          <span 
                            className="eyebrow" 
                            style={{
                              background: order.status === 'Cancelled' ? '#fbe9e8' : 'var(--accent-soft)',
                              color: order.status === 'Cancelled' ? 'var(--danger)' : 'var(--accent)',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem'
                            }}
                          >
                            {order.status}
                          </span>
                        </div>
                        
                        <button style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', background: '#fff' }}>
                        {/* Products List in Order */}
                        <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Garments Ordered</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid #f6f6ef', paddingBottom: '0.4rem' }}>
                              <div>
                                <strong>{item.name}</strong> 
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                          <div>
                            <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem' }}>Delivery Address</h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                              {order.address}
                            </p>
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem' }}>Payment Summary</h4>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              Method: {order.paymentMethod || 'Cash on Delivery'}
                            </p>
                          </div>
                        </div>

                        {/* Progress Milestones (Stepper) */}
                        {order.status !== 'Cancelled' ? (
                          <div>
                            <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem' }}>Delivery Tracking</h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 0.5rem', overflowX: 'auto' }}>
                              {/* Stepper horizontal progress line */}
                              <div 
                                style={{
                                  position: 'absolute',
                                  top: '16px',
                                  left: '4%',
                                  right: '4%',
                                  height: '3px',
                                  background: 'var(--border)',
                                  zIndex: 1
                                }}
                              />
                              {/* Active stepper line overlay */}
                              {currentStepIdx >= 0 && (
                                <div 
                                  style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '4%',
                                    width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 92}%`,
                                    height: '3px',
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
                                      gap: '0.4rem',
                                      zIndex: 2,
                                      position: 'relative'
                                    }}
                                  >
                                    <div 
                                      style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        background: isActive ? 'var(--accent)' : isCompleted ? 'var(--accent)' : '#fff',
                                        border: isCompleted ? '0' : '2px solid var(--border)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        color: isCompleted ? '#fff' : 'var(--text-muted)',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {isCompleted ? <CheckCircleIcon fontSize="inherit" style={{ fontSize: '0.85rem' }} /> : idx + 1}
                                    </div>
                                    <span 
                                      style={{
                                        fontSize: '0.75rem',
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
                          <div style={{ padding: '0.75rem', background: '#fbe9e8', color: 'var(--danger)', borderRadius: '10px', fontWeight: 600, textAlign: 'center', fontSize: '0.85rem' }}>
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
        </article>

      </div>
    </main>
  );
};

export default Profile;
