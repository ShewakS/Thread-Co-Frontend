import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-shell">
        <p className="footer-eyebrow">THREAD & CO</p>
        <h2 className="footer-heading">Built with the same clean theme from header to footer.</h2>
        <div className="footer-widget">
          <div className="footer-column">
            <h3>About Company</h3>
            <p>Modern clothing essentials for men, women, kids, and accessories.</p>
            <p>Designed for everyday wear with a consistent brand look.</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/products?category=Men">Men</Link>
            <Link to="/products?category=Women">Women</Link>
            <Link to="/products?category=Kids">Kids</Link>
            <Link to="/products?category=Accessories">Accessories</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-column">
            <h3>Contact Information</h3>
            <p>Email: support@threadco.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Bengaluru, India</p>
          </div>
          <div className="footer-column social-column">
            <h3>Social Connects</h3>
            <a href="https://www.instagram.com/_shezz_45/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <span className="social-icon"><InstagramIcon fontSize="inherit" /></span>
              Instagram
            </a>
            <a href="https://www.linkedin.com/in/shewak-s-a9287b33b/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <span className="social-icon"><LinkedInIcon fontSize="inherit" /></span>
              LinkedIn
            </a>
            <a href="https://x.com/Shewak_45" target="_blank" rel="noreferrer" aria-label="Twitter">
              <span className="social-icon"><XIcon fontSize="inherit" /></span>
              Twitter
            </a>
            <a href="https://github.com/ShewakS" target="_blank" rel="noreferrer" aria-label="Github">
              <span className="social-icon"><GitHubIcon fontSize="inherit" /></span>
              Github
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} THREAD & CO. All rights reserved.</p>
          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/privacy" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => window.scrollTo(0, 0)}>Terms & Conditions</Link>
            <Link to="/faq" onClick={() => window.scrollTo(0, 0)}>FAQ</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
