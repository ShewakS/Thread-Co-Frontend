import { useLocation } from 'react-router-dom';
import OfferBar from './OfferBar';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password'];

const Layout = ({ children }) => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return children;

  if (AUTH_ROUTES.includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <OfferBar />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
};

export default Layout;
