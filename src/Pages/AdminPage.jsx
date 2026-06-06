import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useStore, validators, formatMoney } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const AdminPage = () => {
  const {
    adminSession,
    users,
    products,
    orders,
    adminLogin,
    adminLogout,
    addProduct,
    deleteProduct
  } = useStore();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [addForm, setAddForm] = useState({ name: '', category: '', price: '', image: '' });
  const [loginNotice, setLoginNotice] = useState(null);
  const [addNotice, setAddNotice] = useState(null);

  const pendingOrders = useMemo(
    () => orders.filter((order) => String(order.status).toLowerCase() === 'pending').length,
    [orders]
  );

  const submitLogin = async (event) => {
    event.preventDefault();
    setLoginNotice(null);
    if (!validators.isValidEmail(loginForm.email)) return setLoginNotice({ type: 'error', text: 'Enter a valid email address.' });
    if (!loginForm.password) return setLoginNotice({ type: 'error', text: 'Password is required.' });

    const result = await adminLogin(loginForm);
    setLoginNotice({ type: result.ok ? 'success' : 'error', text: result.message });
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    setAddNotice(null);

    if (!validators.isValidName(addForm.name)) return setAddNotice({ type: 'error', text: 'Enter a valid product name.' });
    if (!addForm.category) return setAddNotice({ type: 'error', text: 'Select a category.' });
    if (!/^[1-9]\d*$/.test(addForm.price)) return setAddNotice({ type: 'error', text: 'Enter a valid price.' });
    if (!validators.isValidImage(addForm.image)) return setAddNotice({ type: 'error', text: 'Import a product image from your device.' });

    const result = await addProduct(addForm);
    if (!result.ok) return setAddNotice({ type: 'error', text: result.message });

    setAddForm({ name: '', category: '', price: '', image: '' });
    setAddNotice({ type: 'success', text: 'Product added successfully.' });
  };

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

  return (
    <section className="section">
      <section className="container">
        <header className="page-heading">
          <h1 className="section-title">Admin Panel</h1>
          <p className="section-subtitle">Demo admin credentials: admin@threadco.com / admin123</p>
        </header>

        {!adminSession ? (
          <article className="form-wrap" style={{ marginTop: 0 }}>
            <h2 className="form-title">Admin Login</h2>
            <p className="form-subtitle">Login to access dashboard controls.</p>
            <form className="form-grid" onSubmit={submitLogin} noValidate>
              <TextField
                label="Admin Email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                type="email"
              />
              <TextField
                label="Password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                type="password"
              />
              <Button color="secondary" variant="contained" className="btn" type="submit">
                Login to Dashboard
              </Button>
              {loginNotice ? <Alert severity={loginNotice.type}>{loginNotice.text}</Alert> : null}
            </form>
          </article>
        ) : (
          <div className="admin-shell" style={{ display: 'grid' }}>
            <div className="admin-top">
              <h2 style={{ margin: 0 }}>Dashboard Overview</h2>
              <Button color="secondary" variant="outlined" className="btn" onClick={adminLogout}>Logout</Button>
            </div>

            <section className="stats-grid" aria-label="Admin statistics cards">
              <article className="stat-card"><p className="stat-label">Total Products</p><p className="stat-value">{products.length}</p></article>
              <article className="stat-card"><p className="stat-label">Total Orders</p><p className="stat-value">{orders.length}</p></article>
              <article className="stat-card"><p className="stat-label">Total Users</p><p className="stat-value">{users.length}</p></article>
              <article className="stat-card"><p className="stat-label">Pending Orders</p><p className="stat-value">{pendingOrders}</p></article>
            </section>

            <article className="content-block">
              <h3>Recent Orders</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>{formatMoney(order.total)}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="content-block">
              <h3>Add New Product</h3>
              <form className="form-grid" onSubmit={submitProduct} noValidate>
                <TextField
                  label="Product Name"
                  value={addForm.name}
                  onChange={(event) => setAddForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <TextField
                  select
                  label="Category"
                  value={addForm.category}
                  onChange={(event) => setAddForm((prev) => ({ ...prev, category: event.target.value }))}
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
                <Button color="secondary" variant="contained" className="btn" type="submit">Add Product</Button>
                {addNotice ? <Alert severity={addNotice.type}>{addNotice.text}</Alert> : null}
              </form>
            </article>

            <article className="content-block">
              <h3>Manage Products</h3>
              <div className="added-products">
                {products.map((product) => (
                  <article className="card" key={product.id}>
                    <div className="card-media"><img src={resolveImage(product.image)} alt={product.name} /></div>
                    <div className="card-body">
                      <h3 className="card-title">{product.name}</h3>
                      <p className="card-meta">{product.category}</p>
                      <p className="card-price">{formatMoney(product.price)}</p>
                      <Button color="error" variant="contained" className="btn" onClick={() => deleteProduct(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </article>
          </div>
        )}
      </section>
    </section>
  );
};

export default AdminPage;
