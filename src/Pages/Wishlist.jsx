import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useStore, formatMoney } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, moveToCart } = useStore();

  return (
    <main className="section section-alt">
      <section className="container">
        <header className="page-heading">
          <h1 className="section-title">My Wishlist</h1>
          <p className="section-subtitle">Your saved styling selections.</p>
        </header>

        {wishlist.length === 0 ? (
          <article className="content-block" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
            <FavoriteBorderIcon style={{ fontSize: '4rem', color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1.5rem' }} />
            <h3>Your Wishlist is Empty</h3>
            <p className="muted" style={{ marginBottom: '2rem' }}>
              Explore our fresh collection and save your favorite garments here for easy ordering later!
            </p>
            <Button color="secondary" variant="contained" component={Link} to="/products">
              Explore Collection
            </Button>
          </article>
        ) : (
          <div className="grid-4 product-grid">
            {wishlist.map((product) => (
              <article className="card product-card" key={product.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-media" style={{ position: 'relative' }}>
                  <img src={resolveImage(product.image)} alt={product.name} />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 0,
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--danger)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                    }}
                    title="Remove from wishlist"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
                <div className="card-body" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-meta">{product.category}</p>
                    <p className="card-price">{formatMoney(product.price)}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                    <Button 
                      color="secondary" 
                      variant="contained" 
                      onClick={() => moveToCart(product, 'M', 'Standard')}
                      startIcon={<ShoppingBagOutlinedIcon fontSize="small" />}
                      className="btn"
                    >
                      Move to Bag
                    </Button>
                    <Link 
                      to={`/product/${product.id}`} 
                      className="btn" 
                      style={{ 
                        textAlign: 'center', 
                        border: '1px solid var(--border)', 
                        borderRadius: '10px', 
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        padding: '0.45rem 0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Wishlist;
