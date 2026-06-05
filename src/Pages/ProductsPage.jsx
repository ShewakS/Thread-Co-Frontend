import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import LocalTagIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StraightenIcon from '@mui/icons-material/Straighten';
import ProductCard from '../Components/ProductCard';
import { useStore } from '../Components/StoreContext';

const filters = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

const ProductsPage = () => {
  const { products, addToCart, offers } = useStore();
  const [searchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');
  const querySearch = searchParams.get('search');
  const [filter, setFilter] = useState(queryCategory || 'All');
  const [keyword, setKeyword] = useState(querySearch || '');
  const [copyNotice, setCopyNotice] = useState(null);
  const [showOffers, setShowOffers] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopyNotice(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopyNotice(null), 3000);
  };

  const activeOffers = useMemo(() => {
    return (offers || []).filter(o => o.active === true || o.status === 'Active');
  }, [offers]);

  useEffect(() => {
    setFilter(queryCategory || 'All');
  }, [queryCategory]);

  useEffect(() => {
    setKeyword(querySearch || '');
  }, [querySearch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const byCategory = filter === 'All' || product.category.toLowerCase() === filter.toLowerCase();
      const byKeyword = product.name.toLowerCase().includes(keyword.toLowerCase());
      return byCategory && byKeyword;
    });
  }, [products, filter, keyword]);

  return (
    <section className="section">
      <div className="container">
        <header className="page-heading">
          <h1 className="section-title">Our Products</h1>
          <p className="section-subtitle">Browse minimal essentials by category.</p>
        </header>

        {copyNotice && (
          <Alert severity="success" style={{ marginBottom: '1.5rem' }}>
            {copyNotice}
          </Alert>
        )}

        <div className="controls-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="filter-buttons" role="group" aria-label="Product category filters">
            {filters.map((entry) => (
              <Button
                key={entry}
                className={`filter-btn ${filter === entry ? 'active' : ''}`}
                variant={filter === entry ? 'contained' : 'outlined'}
                onClick={() => setFilter(entry)}
              >
                {entry}
              </Button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {activeOffers.length > 0 && (
              <Button 
                variant={showOffers ? "contained" : "outlined"} 
                color="secondary" 
                onClick={() => setShowOffers(!showOffers)}
                startIcon={<LocalTagIcon />}
                size="small"
                style={{ borderRadius: '8px', textTransform: 'none' }}
              >
                {showOffers ? "Hide Offers" : "View Offers"}
              </Button>
            )}

            <Button
              component={Link}
              to="/size-guide"
              variant="outlined"
              color="secondary"
              startIcon={<StraightenIcon />}
              size="small"
              style={{ borderRadius: '8px', textTransform: 'none' }}
            >
              View Size Guide
            </Button>

            <div className="search-box" style={{ border: 0, maxWidth: '220px' }}>
              <TextField
                fullWidth
                value={keyword}
                onChange={(event) => setKeyword(event.target.value.trimStart())}
                placeholder="Search products..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
        </div>

        {showOffers && activeOffers.length > 0 && (
          <div style={{ marginBottom: '2.5rem', marginTop: '1rem' }}>
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
              <LocalTagIcon color="secondary" /> Limited Time Coupons & Offers
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {activeOffers.map((off) => (
                <div 
                  key={off.code} 
                  style={{ 
                    background: '#fff', 
                    border: '1px dashed var(--border)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1.25rem 1rem',
                    borderRadius: '16px',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: 'var(--black)' }}>
                      {off.code === 'FREESHIP' ? 'Free Delivery' : `${off.discount}% Off Checkout`}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Code: <code>{off.code}</code>
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleCopyCode(off.code)}
                    style={{
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.8rem',
                      width: '100%',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                    title="Click to copy"
                  >
                    Copy Code
                    <ContentCopyIcon style={{ fontSize: '0.9rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="product-grid">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))
          ) : (
            <p className="card-meta">No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
