import { useState } from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import LocalTagIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useStore } from '../Components/StoreContext';
import ProductCard from '../Components/ProductCard';

const Offers = () => {
  const { offers, products, addToCart } = useStore();
  const [copyNotice, setCopyNotice] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopyNotice(`Coupon code "${code}" copied to clipboard!`);
    setTimeout(() => setCopyNotice(null), 3000);
  };

  // Get active offers
  const activeOffers = offers.filter(o => o.status === 'Active');

  // Filter some products to show as "Sale Products" (mocked discount cards)
  const saleProducts = products.slice(2, 6);

  return (
    <main className="section section-alt">
      <div className="container">
        <header className="page-heading">
          <h1 className="section-title">Special Offers</h1>
          <p className="section-subtitle">Exclusive savings, promotional coupons, and seasonal discounts.</p>
        </header>

        {copyNotice && (
          <Alert severity="success" style={{ marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
            {copyNotice}
          </Alert>
        )}

        {/* Dynamic Promotional Banners */}
        <section className="hero" style={{ marginBottom: '3rem', gridTemplateColumns: '1fr', padding: '3.5rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #2f3e34 0%, #1f2a23 100%)', color: '#fff', border: 0 }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <p className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#eff4ea', margin: '0 auto 1rem' }}>MID-SUMMER BONANZA</p>
            <h2 className="hero-title" style={{ fontSize: '3rem', color: '#fff', maxWidth: '100%', marginBottom: '1rem', lineHeight: 1.1 }}>
              UP TO 40% EXTRA OFF
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', marginBottom: '2rem' }}>
              Redefine your style statements with natural garments and premium silhouettes. Use checkout coupons below.
            </p>
            <Button color="secondary" variant="contained" style={{ padding: '0.75rem 2rem' }}>
              Explore Collection
            </Button>
          </div>
        </section>

        {/* Active Coupon Cards */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '2rem' }}>
            Copy Active Coupon Codes
          </h2>
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            {activeOffers.map((off) => (
              <article 
                key={off.code} 
                className="content-block" 
                style={{ 
                  margin: 0, 
                  background: '#fff', 
                  border: '2px dashed var(--border)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '2rem 1.5rem',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow)'
                }}
              >
                <div>
                  <LocalTagIcon style={{ fontSize: '3rem', color: 'var(--warm-brown)', marginBottom: '1rem' }} />
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>
                    {off.code === 'FREESHIP' ? 'Free Delivery' : `${off.discount}% Flat Savings`}
                  </h3>
                  <p style={{ margin: '0 0 1.5rem', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                    Active until {off.endDate || '2026-06-30'}
                  </p>
                </div>
                
                <button
                  onClick={() => handleCopyCode(off.code)}
                  style={{
                    background: 'var(--bg-muted)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '0.65rem 1.25rem',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    letterSpacing: '0.04em'
                  }}
                  title="Click to copy"
                >
                  <code>{off.code}</code>
                  <ContentCopyIcon fontSize="inherit" />
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Sale Products Grid */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.85rem', textAlign: 'center', marginBottom: '2rem' }}>
            Sale Highlights
          </h2>
          <div className="grid-4 product-grid">
            {saleProducts.map(p => (
              <div key={p.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <span 
                  className="eyebrow" 
                  style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    left: '15px', 
                    zIndex: 5, 
                    background: 'var(--danger)', 
                    color: '#fff',
                    fontSize: '0.74rem'
                  }}
                >
                  SALE
                </span>
                <ProductCard product={p} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Offers;
