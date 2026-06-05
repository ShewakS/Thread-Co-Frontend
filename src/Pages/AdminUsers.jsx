import { useState, useMemo } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useStore } from '../Components/StoreContext';

const AdminUsers = () => {
  const { users, orders } = useStore();

  // Selected user for details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const userStats = useMemo(() => {
    return users.map(user => {
      // Find orders matching this user
      const count = orders.filter(
        ord => 
          String(ord.customer).toLowerCase() === String(user.name).toLowerCase() ||
          String(ord.email).toLowerCase() === String(user.email).toLowerCase()
      ).length;

      return {
        ...user,
        totalOrders: count
      };
    });
  }, [users, orders]);

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>User Directory</h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Browse customer databases, emails, contact phones, and order histories.</p>
      </div>

      <article className="content-block" style={{ padding: '1.5rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          Registered Accounts
        </h3>
        
        <TableContainer component={Paper} elevation={0} style={{ background: 'transparent' }}>
          <Table>
            <TableHead style={{ background: '#f6f6ef' }}>
              <TableRow>
                <TableCell style={{ fontWeight: 800 }}>Profile</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Name</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Email Address</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Phone</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Role</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Total Orders</TableCell>
                <TableCell style={{ fontWeight: 800 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userStats.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <AccountCircleOutlinedIcon style={{ color: 'var(--text-muted)' }} />
                  </TableCell>
                  <TableCell style={{ fontWeight: 700 }}>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone || 'Not Specified'}</TableCell>
                  <TableCell>
                    <span 
                      className="eyebrow" 
                      style={{
                        background: row.role === 'admin' ? '#2f3e34' : 'var(--border)',
                        color: row.role === 'admin' ? '#fff' : 'var(--text)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem'
                      }}
                    >
                      {row.role}
                    </span>
                  </TableCell>
                  <TableCell style={{ fontWeight: 700 }}>{row.totalOrders}</TableCell>
                  <TableCell>
                    <Button 
                      color="secondary" 
                      variant="outlined" 
                      size="small"
                      onClick={() => handleOpenDetails(row)}
                      style={{ textTransform: 'none', borderRadius: '8px', fontSize: '0.75rem' }}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </article>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          User Details: {selectedUser?.name}
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingTop: '0.5rem', minWidth: '380px' }}>
          <div>
            <strong>Email Address:</strong>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)' }}>{selectedUser?.email}</p>
          </div>
          <div>
            <strong>Phone Contact:</strong>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)' }}>{selectedUser?.phone || 'Not Specified'}</p>
          </div>
          <div>
            <strong>Account Role:</strong>
            <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{selectedUser?.role}</p>
          </div>
          <div>
            <strong>Saved Delivery Addresses:</strong>
            {selectedUser?.addresses && selectedUser.addresses.length > 0 ? (
              <ul style={{ paddingLeft: '1.2rem', margin: '0.35rem 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {selectedUser.addresses.map((addr, idx) => (
                  <li key={idx} style={{ marginBottom: '0.4rem' }}>{addr}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: '0.2rem 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>No addresses configured.</p>
            )}
          </div>
        </DialogContent>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem 1.5rem' }}>
          <Button onClick={() => setDialogOpen(false)} color="secondary" variant="contained">
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
