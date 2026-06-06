import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useStore, formatMoney, validators } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const AdminProducts = () => {
  const { products, addProduct, deleteProduct, updateProductStock } = useStore();

  const [addForm, setAddForm] = useState({ name: '', category: '', price: '', image: '' });
  const [addNotice, setAddNotice] = useState(null);

  // Edit stock dialog state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockForm, setStockForm] = useState({ S: 0, M: 0, L: 0, XL: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAddNotice({ type: 'error', text: 'Please import a valid image file.' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAddNotice({ type: 'error', text: 'Please choose an image smaller than 2MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAddForm((prev) => ({ ...prev, image: reader.result }));
      setAddNotice({ type: 'success', text: 'Image imported successfully.' });
    };
    reader.onerror = () => {
      setAddNotice({ type: 'error', text: 'Unable to import this image.' });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setAddNotice(null);

    if (!validators.isValidName(addForm.name)) return setAddNotice({ type: 'error', text: 'Enter a valid product name.' });
    if (!addForm.category) return setAddNotice({ type: 'error', text: 'Select a category.' });
    if (!/^[1-9]\d*$/.test(addForm.price)) return setAddNotice({ type: 'error', text: 'Enter a valid price.' });
    if (!validators.isValidImage(addForm.image)) return setAddNotice({ type: 'error', text: 'Import a product image from your device.' });

    const result = await addProduct({
      name: addForm.name,
      category: addForm.category,
      price: Number(addForm.price),
      image: addForm.image
    });
    if (!result.ok) return setAddNotice({ type: 'error', text: result.message });

    setAddForm({ name: '', category: '', price: '', image: '' });
    setAddNotice({ type: 'success', text: 'Product added successfully.' });
    setTimeout(() => setAddNotice(null), 3000);
  };

  const handleOpenStockDialog = (product) => {
    setSelectedProduct(product);
    const stock = product.stock || { S: 10, M: 15, L: 8, XL: 5 };
    setStockForm({
      S: stock.S || 0,
      M: stock.M || 0,
      L: stock.L || 0,
      XL: stock.XL || 0
    });
    setDialogOpen(true);
  };

  const handleSaveStock = () => {
    if (!selectedProduct) return;
    updateProductStock(selectedProduct.id, 'S', stockForm.S);
    updateProductStock(selectedProduct.id, 'M', stockForm.M);
    updateProductStock(selectedProduct.id, 'L', stockForm.L);
    updateProductStock(selectedProduct.id, 'XL', stockForm.XL);
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div>
        <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>Product Catalog</h1>
        <p className="muted" style={{ margin: 0, color: 'var(--text-muted)' }}>Manage products, inventories, and sizes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Products Management List */}
        <article className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            Garment Inventories
          </h3>
          <TableContainer component={Paper} elevation={0} style={{ background: 'transparent' }}>
            <Table size="small">
              <TableHead style={{ background: '#f6f6ef' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 800 }}>Media</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Price</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Stock (S, M, L, XL)</TableCell>
                  <TableCell style={{ fontWeight: 800 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((row) => {
                  const stock = row.stock || { S: 10, M: 15, L: 8, XL: 5 };
                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div style={{ width: '40px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={resolveImage(row.image)} alt="media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <strong>{row.name}</strong>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{row.category}</div>
                      </TableCell>
                      <TableCell style={{ fontWeight: 700 }}>{formatMoney(row.price)}</TableCell>
                      <TableCell>
                        <span style={{ fontSize: '0.84rem' }}>
                          S: <strong>{stock.S}</strong> | M: <strong>{stock.M}</strong> | L: <strong>{stock.L}</strong> | XL: <strong>{stock.XL}</strong>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button
                            onClick={() => handleOpenStockDialog(row)}
                            style={{
                              border: 0,
                              background: 'transparent',
                              color: 'var(--accent)',
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                            title="Edit size stock"
                          >
                            <EditIcon fontSize="small" />
                          </button>
                          <button
                            onClick={() => deleteProduct(row.id)}
                            style={{
                              border: 0,
                              background: 'transparent',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                              padding: '0.25rem'
                            }}
                            title="Delete product"
                          >
                            <DeleteIcon fontSize="small" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </article>

        {/* Add Product Form */}
        <article className="content-block" style={{ padding: '1.5rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AddIcon color="secondary" /> Add New Product
          </h3>
          <form className="form-grid" onSubmit={submitProduct} noValidate>
            <TextField
              label="Product Name"
              value={addForm.name}
              onChange={(event) => setAddForm((prev) => ({ ...prev, name: event.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={addForm.category}
              onChange={(event) => setAddForm((prev) => ({ ...prev, category: event.target.value }))}
              fullWidth
            >
              <MenuItem value="">Select category</MenuItem>
              <MenuItem value="Men">Men</MenuItem>
              <MenuItem value="Women">Women</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </TextField>
            <TextField
              label="Price (INR)"
              type="number"
              value={addForm.price}
              onChange={(event) => setAddForm((prev) => ({ ...prev, price: event.target.value }))}
              fullWidth
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                color="secondary"
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                style={{ borderRadius: '10px', textTransform: 'none' }}
              >
                Import from Device
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageImport}
                />
              </Button>
              {addForm.image ? (
                <div style={{ width: '52px', height: '64px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)', background: '#fff' }}>
                  <img src={resolveImage(addForm.image)} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : null}
            </div>
            <Button color="secondary" variant="contained" className="btn btn-block" type="submit">
              Publish Product
            </Button>
            {addNotice ? <Alert severity={addNotice.type}>{addNotice.text}</Alert> : null}
          </form>
        </article>

      </div>

      {/* Stock Management Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle style={{ fontFamily: 'Georgia, serif', fontWeight: 600 }}>
          Manage Sizing Stock: {selectedProduct?.name}
        </DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem', minWidth: '300px' }}>
          {['S', 'M', 'L', 'XL'].map((sz) => (
            <TextField
              key={sz}
              label={`Size ${sz} Stock`}
              type="number"
              value={stockForm[sz]}
              onChange={(e) => setStockForm(prev => ({ ...prev, [sz]: Math.max(0, Number(e.target.value)) }))}
              fullWidth
            />
          ))}
        </DialogContent>
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveStock} color="secondary" variant="contained">
            Save Stocks
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
