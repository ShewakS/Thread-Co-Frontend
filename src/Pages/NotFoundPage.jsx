import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const NotFoundPage = () => (
  <section className="section section-alt">
    <div className="container page-heading">
      <h1 className="section-title">Page Not Found</h1>
      <p className="section-subtitle">The page you requested does not exist.</p>
      <Button className="btn btn-primary" variant="contained" component={Link} to="/">
        Back to Home
      </Button>
    </div>
  </section>
);

export default NotFoundPage;
