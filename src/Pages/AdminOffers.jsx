import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useStore, validators } from '../Components/StoreContext';

const AdminOffers = () => {
  const { offers, addOffer, deleteOffer, toggleOfferStatus } = useStore();

  const [form, setForm] = useState({ code: '', discount: '', startDate: '', endDate: '' });
  const [notice, setNotice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotice(null);

    const code = form.code.trim().toUpperCase();
    if (!validators.isValidPromo(code)) return setNotice({ type: 'error', text: 'Enter a valid coupon code (alphanumeric, 4-12 chars).' });
    if (!form.discount || Number(form.discount) < 0 || Number(form.discount) > 100) {
      return setNotice({ type: 'error', text: 'Enter a valid discount percentage (0 to 100).' });
    }
    if (!form.startDate || !form.endDate) return setNotice({ type: 'error', text: 'Start Date and End Date are required.' });

    // Prevent duplicates
    if (offers.some(o => String(o.code).toUpperCase() === code)) {
      return setNotice({ type: 'error', text: `Coupon code "${code}" already exists.` });
    }

    addOffer({
      code,
      discount: Number(form.discount),
      startDate: form.startDate,
      endDate: form.endDate
    });
    
    setForm({ code: '', discount: '', startDate: '', endDate: '' });
    setNotice({ type: 'success', text: `Coupon "${code}" published successfully.` });
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Coupon Management</h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Configure promotional store coupons, discount campaigns, and durations.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Active Coupons List */}
        <article className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Coupons Database
          </h3>
          <TableContainer component={Paper} elevation={0} style={{ background: 'transparent' }}>
            <Table size="small">
              <TableHead style={{ background: '#f6f6ef' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Coupon Code</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Savings %</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Validity Period</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offers.map((row) => (
                  <TableRow key={row.code}>
                    <TableCell style={{ fontWeight: 700 }}>
                      <code>{row.code}</code>
                    </TableCell>
                    <TableCell>
                      {row.code === 'FREESHIP' ? 'Free Delivery' : `${row.discount}% OFF`}
                    </TableCell>
                    <TableCell style={{ fontSize: '0.84rem' }}>
                      {row.startDate} to {row.endDate}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleOfferStatus(row.code)}
                        style={{
                          border: 0,
                          borderRadius: '6px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: row.status === 'Active' ? 'var(--accent-soft)' : '#fbe9e8',
                          color: row.status === 'Active' ? 'var(--accent)' : 'var(--danger)'
                        }}
                        title="Click to toggle status"
                      >
                        {row.status}
                      </button>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => deleteOffer(row.code)}
                        disabled={row.code === 'SAVE10' || row.code === 'FREESHIP'} // Protect sample coupons
                        style={{
                          border: 0,
                          background: 'transparent',
                          color: 'var(--danger)',
                          cursor: 'pointer',
                          opacity: (row.code === 'SAVE10' || row.code === 'FREESHIP') ? 0.3 : 1
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </article>

        {/* Add Coupon Form */}
        <article className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AddIcon color="secondary" /> Create Promotion Code
          </h3>
          <form onSubmit={handleSubmit} className="form-grid" noValidate>
            <TextField
              label="Promo Code (e.g. SUMMER20)"
              value={form.code}
              onChange={e => setForm(prev => ({ ...prev, code: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Discount Percentage (0 to 100)"
              type="number"
              value={form.discount}
              onChange={e => setForm(prev => ({ ...prev, discount: e.target.value }))}
              fullWidth
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
            <Button color="secondary" variant="contained" className="btn btn-block" type="submit">
              Publish Promotion
            </Button>
            {notice && <Alert severity={notice.type}>{notice.text}</Alert>}
          </form>
        </article>

      </div>
    </div>
  );
};

export default AdminOffers;
