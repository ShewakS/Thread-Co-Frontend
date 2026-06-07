import { useEffect, useState, useMemo } from 'react';
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
  const { products, addToCart, addToWishlist, wishlist, removeFromWishlist, currentUser, fetchReviews, addReview } = useStore();
  
  // Find product
  const product = useMemo(() => {
    return products.find(p => String(p.id) === String(id)) || products[0];
  }, [products, id]);

  const isWishlisted = useMemo(() => {
    if (!product) return false;
    return wishlist.some(item => String(item.id) === String(product.id));
  }, [wishlist, product]);

  // Gallery images (mocked since we have 1 image per product, we generate variations)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    return [
      product.image,
      product.image, // we reuse the same image as variation
      'images/men%20shirts.jpg', // additional fallback variations
      'images/women%20dress.avif'
    ];
  }, [product]);

  const [activeImage, setActiveImage] = useState(product?.image || '');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Classic Beige');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [notice, setNotice] = useState(null);
  
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!product?.id) return;
    setActiveImage(product.image);

    const loadReviews = async () => {
      const savedReviews = await fetchReviews(product.id);
      setReviews(savedReviews);
    };

    loadReviews();
  }, [fetchReviews, product?.id, product?.image]);

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

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setNotice({ type: 'error', text: 'Please login to submit a review.' });
      return;
    }
    if (!reviewName || !reviewText) return;

    const result = await addReview(product.id, {
      name: reviewName,
      rating: reviewRating,
      text: reviewText
    });

    if (!result.ok) {
      setNotice({ type: 'error', text: result.message });
      return;
    }

    setReviews([result.review, ...reviews]);
    setReviewName('');
    setReviewText('');
    setReviewRating(5);
    setNotice({ type: 'success', text: 'Review submitted successfully.' });
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <main className="section section-alt">
      <div className="container">
        <Link to="/products" className="back-link product-back-link">
          <ArrowBackIcon fontSize="small" /> Back to Collection
        </Link>

        {notice && (
          <Alert severity={notice.type} style={{ marginBottom: '1.5rem' }}>
            {notice.text}
          </Alert>
        )}

        <div className="product-details-grid product-details-shell">
          {/* Gallery Section */}
          <div className="product-gallery">
            <div className="main-image-container product-main-image">
              <img 
                src={resolveImage(activeImage || product.image)} 
                alt={product.name} 
              />
            </div>
            <div className="thumbnail-strip product-thumbnail-strip">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`product-thumb ${activeImage === img ? 'active' : ''}`}
                >
                  <img src={resolveImage(img)} alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="product-purchase-panel">
            <div>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{product.category}</p>
              <h1 className="section-title product-detail-title">{product.name}</h1>
              <div className="product-rating-row">
                <Rating value={product.rating || 4.5} precision={0.5} readOnly size="small" />
                <span>({reviews.length} customer reviews)</span>
              </div>
            </div>

            <div className="product-price-row">
              <span className="product-detail-price">{formatMoney(product.price)}</span>
              <span className="product-compare-price">{formatMoney(product.price * 1.25)}</span>
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
              <div className="product-choice-row">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-choice ${selectedSize === size ? 'active' : ''}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Select Color</label>
              <div className="product-choice-row">
                {['Classic Beige', 'Sage Green', 'Indigo Blue'].map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`color-choice ${selectedColor === color ? 'active' : ''}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Actions */}
            <div>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Quantity</label>
              <div className="product-action-row">
                <div className="quantity-control">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    +
                  </button>
                </div>

                <Button 
                  color="secondary" 
                  variant="contained" 
                  onClick={handleAddToCart}
                  startIcon={<ShoppingBagOutlinedIcon />}
                  className="product-add-button"
                >
                  Add to Bag
                </Button>

                <button 
                  onClick={handleWishlistToggle}
                  className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                </button>
              </div>
            </div>

            {/* Tabbed Info */}
            <div style={{ marginTop: '1.5rem' }}>
              <div className="product-tabs">
                {['details', 'specs', 'care'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={activeTab === tab ? 'active' : ''}
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
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(rev.createdAt || rev.date).toLocaleDateString('en-IN')}</span>
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
                    placeholder={currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Enter your name'} 
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
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default ProductDetails;
