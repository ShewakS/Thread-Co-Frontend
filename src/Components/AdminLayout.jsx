import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useStore } from './StoreContext';

const AdminLayout = () => {
  const { adminLogout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard Overview', to: '/admin/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Manage Products', to: '/admin/products', icon: <InventoryIcon fontSize="small" /> },
    { label: 'Manage Orders', to: '/admin/orders', icon: <ReceiptIcon fontSize="small" /> },
    { label: 'Manage Users', to: '/admin/users', icon: <PeopleIcon fontSize="small" /> },
    { label: 'Manage Offers', to: '/admin/offers', icon: <LocalOfferIcon fontSize="small" /> }
  ];

  return (
    <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: 'var(--bg-muted)' }}>
      {/* Sidebar Panel */}
      <aside className="admin-sidebar" style={{ background: '#273228', color: '#fff', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#eff4ea', opacity: 0.7, marginBottom: '1rem', fontWeight: 700 }}>
              <ArrowBackIcon fontSize="inherit" /> Back to Storefront
            </Link>
            <h2 style={{ margin: 0, fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: '1.75rem', letterSpacing: '0.02em', color: '#fff', cursor: "pointer"}} onClick={()=>navigate("/")}>
              THREAD ADMIN
            </h2>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Store Operations Console</span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  color: isActive ? '#fff' : '#c7d6c8',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                })}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <Button
          color="error"
          variant="contained"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          style={{ width: '100%', borderRadius: '10px', background: 'var(--danger)', padding: '0.65rem' }}
        >
          Logout Session
        </Button>
      </aside>

      {/* Main Content View Panel */}
      <main className="admin-content" style={{ padding: '3rem 4rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
