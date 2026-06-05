import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useStore, formatMoney } from '../Components/StoreContext';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useStore();

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Customer Orders</h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Monitor order statuses, shipments, and customer payments.</p>
      </div>

      <article className="content-block" style={{ padding: '1.5rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          Global Orders Database
        </h3>
        
        {orders.length === 0 ? (
          <p>No orders placed yet.</p>
        ) : (
          <TableContainer component={Paper} elevation={0} style={{ background: 'transparent' }}>
            <Table>
              <TableHead style={{ background: '#f6f6ef' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Order ID</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Customer Info</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Purchased Garments</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Total Paid</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Order Date</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Status Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell style={{ fontWeight: 700 }}>{row.id}</TableCell>
                    <TableCell>
                      <strong>{row.customer}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email || 'guest@threadco.com'}</div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        {(row.items || []).map((item, idx) => (
                          <span key={idx} style={{ fontSize: '0.84rem' }}>
                            {item.name} <span style={{ color: 'var(--text-muted)' }}>(Qty: {item.quantity} | {item.size})</span>
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: 700 }}>{formatMoney(row.total)}</TableCell>
                    <TableCell>{row.date || '2026-06-02'}</TableCell>
                    <TableCell>
                      <Select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        size="small"
                        style={{
                          fontSize: '0.82rem',
                          background: '#fff',
                          minWidth: '120px',
                          borderRadius: '8px'
                        }}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <MenuItem key={opt} value={opt} style={{ fontSize: '0.82rem' }}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </article>
    </div>
  );
};

export default AdminOrders;
