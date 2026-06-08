import { useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStore, formatMoney } from '../Components/StoreContext';

const AdminDashboard = () => {
  const { products, orders, users } = useStore();

  // Metrics Calculations
  const stats = useMemo(() => {
    const customerCount = users.filter(u => u.role !== 'admin').length;
    const completedOrders = orders.filter(o => o.status !== 'Cancelled');
    const revenueSum = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

    return {
      productsCount: products.length,
      ordersCount: orders.length,
      customerCount,
      revenue: revenueSum
    };
  }, [products, orders, users]);

  // Recent 5 orders
  const recentOrders = useMemo(() => {
    return orders.slice(0, 5);
  }, [orders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Dashboard Overview</h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Operations snapshot for THREAD & CO.</p>
      </div>

      {/* KPI Stats Grid */}
      <section className="stats-grid">
        {[
          { label: 'Total Revenue', value: formatMoney(stats.revenue), bg: 'linear-gradient(135deg, #2f3e34 0%, #1f2a23 100%)', color: '#fff' },
          { label: 'Total Orders', value: stats.ordersCount, bg: '#fff', color: 'var(--text)' },
          { label: 'Total Products', value: stats.productsCount, bg: '#fff', color: 'var(--text)' },
          { label: 'Registered Customers', value: stats.customerCount, bg: '#fff', color: 'var(--text)' }
        ].map((card, idx) => (
          <article 
            key={idx} 
            className="content-block" 
            style={{ 
              margin: 0, 
              padding: '1.75rem', 
              background: card.bg, 
              color: card.color,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              boxShadow: 'var(--shadow)',
              border: card.bg === '#fff' ? '1px solid var(--border)' : '0'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: card.color === '#fff' ? 0.8 : 0.65 }}>
              {card.label}
            </span>
            <strong style={{ fontSize: '1.8rem', fontWeight: 800 }}>{card.value}</strong>
          </article>
        ))}
      </section>

      {/* Main Stats Rows */}
     <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Recent Orders Card */}
        <article className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Recent Orders
          </h3>
          <TableContainer component={Paper} elevation={0} style={{ background: 'transparent' }}>
            <Table>
              <TableHead style={{ background: '#f6f6ef' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Order ID</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Customer</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Amount</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{formatMoney(row.total)}</TableCell>
                    <TableCell>
                      <span 
                        className="eyebrow" 
                        style={{ 
                          fontSize: '0.7rem', 
                          background: row.status === 'Cancelled' ? '#fbe9e8' : 'var(--accent-soft)',
                          color: row.status === 'Cancelled' ? 'var(--danger)' : 'var(--accent)'
                        }}
                      >
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </article>

      </div>
    </div>
  );
};

export default AdminDashboard;
