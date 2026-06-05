import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import HeroCarousel from '../Components/HeroCarousel';
import ProductCard from '../Components/ProductCard';
import { useStore } from '../Components/StoreContext';
import { resolveImage } from '../Components/imageMap';

const HomePage = () => {
  const { products, addToCart } = useStore();

  return (
    <>
      <section className="section">
        <div className="container">
          <article className="hero">
            <div className="hero-copy">
              <p className="eyebrow">NEW SEASON</p>
              <h1 className="hero-title">Not just clothes.</h1>
              <h1 className="hero-title">It's an attitude.</h1>
              <div className="hero-actions">
              <Button color="secondary" variant="contained" className="btn" component={Link} to="/products">
                  Shop Now
                </Button>
              </div>
            </div>
            <HeroCarousel />
          </article>

          <div className="feature-strip" aria-label="Service features">
            <div className="feature-grid">
              <article className="feature-card">
                <LocalShippingOutlinedIcon fontSize="small" />
                <p className="feature-title">Free Shipping</p>
                <p className="feature-desc">On orders over ₹1000</p>
              </article>
              <article className="feature-card">
                <AutorenewOutlinedIcon fontSize="small" />
                <p className="feature-title">Easy Return</p>
                <p className="feature-desc">30 Days return policy</p>
              </article>
              <article className="feature-card">
                <WorkspacePremiumOutlinedIcon fontSize="small" />
                <p className="feature-title">Premium Quality</p>
                <p className="feature-desc">Quality you can trust</p>
              </article>
              <article className="feature-card">
                <HeadsetMicOutlinedIcon fontSize="small" />
                <p className="feature-title">Customer Support</p>
                <p className="feature-desc">24/7 assistance</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow" style={{ textAlign: 'center', color: '#c74f4f' }}>OUR SUPPORT</p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Find your style</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Minimal silhouettes for everyday confidence.
          </p>

          <div className="grid-3" style={{ marginBottom: '3rem' }}>
            <article className="card category-card">
              <div className="card-media">
                <img src={resolveImage('images/men shirts.jpg')} alt="Men category" />
              </div>
              <div className="card-body">
                <p className="category-label">Men</p>
                <div className="category-actions">
                  <Button color="secondary" variant="contained" className="btn" component={Link} to="/products?category=Men">
                    Shop Now
                  </Button>
                </div>
              </div>
            </article>
            <article className="card category-card">
              <div className="card-media">
                <img src={resolveImage('images/women dress.avif')} alt="Women category" />
              </div>
              <div className="card-body">
                <p className="category-label">Women</p>
                <div className="category-actions">
                  <Button color="secondary" variant="contained" className="btn" component={Link} to="/products?category=Women">
                    Shop Now
                  </Button>
                </div>
              </div>
            </article>
            <article className="card category-card">
              <div className="card-media">
                <img src={resolveImage('images/accessories.jpg')} alt="Accessories category" />
              </div>
              <div className="card-body">
                <p className="category-label">Accessories</p>
                <div className="category-actions">
                  <Button color="secondary" variant="contained" className="btn" component={Link} to="/products?category=Accessories">
                    Shop Now
                  </Button>
                </div>
              </div>
            </article>
          </div>

          <h2 className="section-title" style={{ textAlign: 'center', marginTop: '4rem' }}>Featured Products</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>
            Our handpicked arrivals for the season.
          </p>

          <div className="grid-4 product-grid js-home-products">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
