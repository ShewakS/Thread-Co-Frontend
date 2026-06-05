import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useStore, formatMoney } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';
import ProductCard from '../Components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, addToWishlist, wishlist, removeFromWishlist } = useStore();
  
  // Find product
  const product = useMemo(() => {
    return products.find(p => String(p.id) === String(id)) || products[0];
  }, [products, id]);

  const isWishlisted = useMemo(() => {
    return wishlist.some(item => String(item.id) === String(product.id));
  }, [wishlist, product]);

  // Gallery images (mocked since we have 1 image per product, we generate variations)
  const galleryImages = useMemo(() => {
    return [
      product.image,
      product.image, // we reuse the same image as variation
      'images/men%20shirts.jpg', // additional fallback variations
      'images/women%20dress.avif'
    ];
  }, [product]);

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Classic Beige');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [notice, setNotice] = useState(null);
  
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Ananya S.', rating: 5, date: '2026-05-15', text: 'Absolutely love the fabric! It is so soft and comfortable. Perfect fit!' },
    { id: 2, name: 'Rohan M.', rating: 4, date: '2026-05-20', text: 'Great design. Color is slightly darker than the picture but looks very premium.' }
  ]);

  if (!product) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <p>Product not found.</p>
        <Link to="/products"><Button color="secondary" variant="contained">Back to Products</Button></Link>
      </div>
    );
  }

  // Related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setNotice({ type: 'info', text: 'Removed from Wishlist' });
    } else {
      addToWishlist(product);
      setNotice({ type: 'success', text: 'Added to Wishlist!' });
    }
    setTimeout(() => setNotice(null), 3000);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewText) return;
    const newRev = {
      id: Date.now(),
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split('T')[0],
      text: reviewText
    };
    setReviews([newRev, ...reviews]);
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
  };

  return (
    <main className="section section-alt">
      <div className="container">
        <Link to="/products" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          <ArrowBackIcon fontSize="small" /> Back to Collection
        </Link>

        {notice && (
          <Alert severity={notice.type} style={{ marginBottom: '1.5rem' }}>
            {notice.text}
          </Alert>
        )}

        <div className="product-details-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '3rem', margin: '0 auto 4rem' }}>
          {/* Gallery Section */}
          <div className="product-gallery">
            <div className="main-image-container" style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border)', background: '#fff', aspectRatio: '4/5', marginBottom: '1rem' }}>
              <img 
                src={resolveImage(activeImage || product.image)} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="thumbnail-strip" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto' }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    border: activeImage === img ? '2px solid var(--accent)' : '1px solid var(--border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    width: '72px',
                    height: '90px',
                    cursor: 'pointer',
                    background: '#fff',
                    padding: 0,
                    opacity: activeImage === img ? 1 : 0.7
                  }}
                >
                  <img src={resolveImage(img)} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="product-purchase-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{product.category}</p>
              <h1 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>({reviews.length} customer reviews)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--black)' }}>{formatMoney(product.price)}</span>
              <span style={{ textDecoration: 'line-line-through', color: 'var(--text-muted)', opacity: 0.7 }}>{formatMoney(product.price * 1.25)}</span>
              <span className="eyebrow" style={{ background: '#fbe9e8', color: 'var(--danger)', fontSize: '0.78rem' }}>20% OFF</span>
            </div>

            <hr style={{ border: 0, borderBottom: '1px solid var(--border)', margin: 0 }} />

            {/* Size Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 700 }}>Select Size</label>
                <Link to="/size-guide" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    style={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    View Size Guide
                  </Button>
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: selectedSize === size ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: selectedSize === size ? 'var(--accent)' : '#fff',
                      color: selectedSize === size ? '#fff' : 'var(--text)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Select Color</label>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                {['Classic Beige', 'Sage Green', 'Indigo Blue'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '999px',
                      border: selectedColor === color ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: selectedColor === color ? 'var(--accent-soft)' : '#fff',
                      color: 'var(--text)',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Actions */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ padding: '0.6rem 1rem', border: 0, background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ padding: '0.6rem 1rem', border: 0, background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>

                <Button 
                  color="secondary" 
                  variant="contained" 
                  onClick={handleAddToCart}
                  startIcon={<ShoppingBagOutlinedIcon />}
                  style={{ flex: 1, padding: '0.8rem 1.5rem', borderRadius: '12px' }}
                >
                  Add to Bag
                </Button>

                <button 
                  onClick={handleWishlistToggle}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    color: isWishlisted ? 'var(--danger)' : 'var(--text-muted)'
                  }}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                </button>
              </div>
            </div>

            {/* Tabbed Info */}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                {['details', 'specs', 'care'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.6rem 1.2rem',
                      border: 0,
                      background: 'transparent',
                      borderBottom: activeTab === tab ? '2px solid var(--accent)' : '0',
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {tab === 'details' ? 'Description' : tab === 'specs' ? 'Fabric Details' : 'Care Guide'}
                  </button>
                ))}
              </div>

              <div style={{ fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {activeTab === 'details' && (
                  <p>
                    Elevate your wardrobe with the premium {product.name}. Carefully cut from breathable natural fibres, 
                    it offers an effortless casual fit with clean minimalist lines. Designed for long-lasting wearability, 
                    this garment moves comfortably with you throughout the seasons.
                  </p>
                )}
                {activeTab === 'specs' && (
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Composition: 100% Premium Eco-Linen / Breathable Combed Cotton blend</li>
                    <li>Weave: High-density sustainable knit pattern</li>
                    <li>Sourcing: Responsibly manufactured and dyed</li>
                    <li>Mid-weight fabric suitable for year-round styling</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul style={{ paddingLeft: '1.2rem' }}>
                    <li>Machine wash cold with like colors, gentle cycle</li>
                    <li>Do not bleach or dry clean</li>
                    <li>Tumble dry low or air dry in shade to maintain drape</li>
                    <li>Warm iron inside out if necessary</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="content-block" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Customer Feedback</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '3rem' }}>
            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map(rev => (
                <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700 }}>{rev.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                  <Rating value={rev.rating} readOnly size="small" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted)' }}>{rev.text}</p>
                </div>
              ))}
            </div>

            {/* Write a Review */}
            <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Write a Review</h3>
              <form onSubmit={handleAddReview} className="form-grid">
                <div className="field">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    value={reviewName} 
                    onChange={e => setReviewName(e.target.value)} 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div className="field">
                  <label>Rating</label>
                  <Rating 
                    value={reviewRating} 
                    onChange={(_, val) => setReviewRating(val)} 
                  />
                </div>
                <div className="field">
                  <label>Review Message</label>
                  <textarea 
                    value={reviewText} 
                    onChange={e => setReviewText(e.target.value)} 
                    placeholder="Share your thoughts about this product..." 
                    required 
                  />
                </div>
                <Button color="secondary" variant="contained" type="submit" style={{ marginTop: '0.5rem' }}>
                  Submit Review
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
            <h2 className="section-title" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>You May Also Like</h2>
            <div className="grid-4 product-grid">
              {relatedProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <ProductCard product={p} onAddToCart={addToCart} />
                  <Link 
                    to={`/product/${p.id}`} 
                    className="btn" 
                    style={{ 
                      marginTop: '0.5rem', 
                      textAlign: 'center', 
                      background: 'var(--accent)', 
                      color: '#fff', 
                      borderRadius: '10px', 
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.5rem'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetails;
