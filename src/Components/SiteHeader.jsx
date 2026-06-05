import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useStore } from "./StoreContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Men", to: "/products?category=Men" },
  { label: "Women", to: "/products?category=Women" },
  { label: "Kids", to: "/products?category=Kids" },
  { label: "Accessories", to: "/products?category=Accessories" },
];

const SiteHeader = () => {
  const { cart, wishlist, currentUser, logout } = useStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);
  const toggleRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  const cartCount = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const clickHandler = (event) => {
      if (!navRef.current || !toggleRef.current) return;
      if (
        !navRef.current.contains(event.target) &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    const resizeHandler = () => {
      if (window.innerWidth > 960) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("click", clickHandler);
    window.addEventListener("resize", resizeHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    setSearchOpen(false);
    setSearchQuery("");
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="logo" to="/">
          THREAD & CO
        </Link>

        <nav
          aria-label="Main navigation"
          className={`nav-links ${isOpen ? "is-open" : ""}`}
          ref={navRef}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <div
            className={`nav-search-wrap ${searchOpen ? "is-open" : ""}`}
            ref={searchRef}
          >
            {searchOpen ? (
              <form className="nav-search-form" onSubmit={submitSearch}>
                <input
                  ref={searchInputRef}
                  type="search"
                  className="nav-search-input"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                />
                <IconButton
                  className="icon-btn nav-search-close"
                  aria-label="Close search"
                  size="small"
                  onClick={() => setSearchOpen(false)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </form>
            ) : null}
            <IconButton
              className="icon-btn nav-search-toggle"
              aria-label="Search products"
              size="small"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </div>

          {currentUser ? (
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
            >
              {currentUser.role === "admin" && (
                <NavLink
                  to="/admin"
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "var(--success)",
                    textDecoration: "none",
                  }}
                >
                  Admin
                </NavLink>
              )}
              <Link className="icon-btn" to="/profile" aria-label="Profile">
                <AccountCircleOutlinedIcon fontSize="small" />
              </Link>
            </div>
          ) : (
            <NavLink className="nav-login-btn" to="/login">
              Login
            </NavLink>
          )}

          <Link
            className="icon-btn cart-wrap"
            to="/wishlist"
            aria-label="Wishlist"
            style={{ position: "relative" }}
          >
            <FavoriteBorderOutlinedIcon fontSize="small" />
            {wishlistCount > 0 && (
              <span
                className="cart-count"
                style={{ background: "var(--warm-brown)" }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link className="icon-btn cart-wrap" to="/cart" aria-label="Cart">
            <ShoppingCartOutlinedIcon fontSize="small" />
            <span className="cart-count">{cartCount}</span>
          </Link>

          {currentUser && (
            <button
              className="nav-login-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{ cursor: "pointer", background: "transparent" }}
            >
              Logout
            </button>
          )}

          <IconButton
            className="menu-toggle"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            ref={toggleRef}
            size="small"
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
