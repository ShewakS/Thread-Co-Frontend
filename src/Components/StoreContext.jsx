import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[A-Za-z][A-Za-z\s.'-]{0,49}$/,
  subject: /^[A-Za-z0-9][A-Za-z0-9\s.,'"()-]{2,99}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
  promo: /^[A-Z0-9]{4,12}$/i,
  image: /^(https?:\/\/|data:image\/|\/|\.?.?\/|images\/).+/i
};

const StoreContext = createContext(null);

const normalizeCart = (cart) => {
  if (!Array.isArray(cart)) return [];
  return cart.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price || 0),
    image: item.image,
    quantity: Math.max(1, Number(item.quantity || 1)),
    size: item.size || 'M',
    color: item.color || 'Standard'
  }));
};

export const formatMoney = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

export const validators = {
  isValidName: (value) => REGEX.name.test(String(value || '').trim()),
  isValidEmail: (value) => REGEX.email.test(String(value || '').trim().toLowerCase()),
  isValidPassword: (value) => REGEX.password.test(String(value || '')),
  isValidSubject: (value) => REGEX.subject.test(String(value || '').trim()),
  isValidPromo: (value) => REGEX.promo.test(String(value || '').trim()),
  isValidImage: (value) => REGEX.image.test(String(value || '').trim())
};

const getPromoState = (subtotal, code, offersList = []) => {
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return { code: '', discount: 0 };
  
  const found = offersList.find(o => String(o.code).toUpperCase() === normalized && o.status === 'Active');
  if (found) {
    if (found.code === 'FREESHIP') return { code: normalized, discount: 0 };
    return { code: normalized, discount: Math.round(subtotal * (Number(found.discount || 0) / 100)) };
  }
  
  if (normalized === 'SAVE10') return { code: normalized, discount: Math.round(subtotal * 0.1) };
  if (normalized === 'FREESHIP') return { code: normalized, discount: 0 };
  return { code: '', discount: 0 };
};

export const getShippingState = (subtotal, method) => {
  const normalized = String(method || 'standard').toLowerCase();
  if (normalized === 'express') return { method: 'express', amount: subtotal >= 1000 ? 99 : 149 };
  if (normalized === 'priority') return { method: 'priority', amount: subtotal >= 1000 ? 149 : 249 };
  return { method: 'standard', amount: subtotal >= 1000 || subtotal === 0 ? 0 : 99 };
};

export const StoreProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState('');
  const [adminSession, setAdminSession] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [promoCode, setPromoCode] = useState('');
  
  // New States
  const [wishlist, setWishlist] = useState([]);
  const [offers, setOffers] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "https://thread-co-backend.onrender.com/api";
  const apiFetch = useCallback((path, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    };

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  }, [API_URL, authToken]);
  // Fetch initial data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await apiFetch('/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }

      try {
        const offersRes = await apiFetch('/offers');
        if (offersRes.ok) {
          const offersData = await offersRes.json();
          setOffers(offersData);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
      }

      try {
        if (authToken) {
          const wishlistRes = await apiFetch('/wishlist');
          if (wishlistRes.ok) {
            const wishlistData = await wishlistRes.json();
            setWishlist(wishlistData);
          }

          const ordersRes = await apiFetch('/orders');
          if (ordersRes.ok) {
            const ordersData = await ordersRes.json();
            setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }

      try {
        if (authToken && currentUser?.role === 'admin') {
          const usersRes = await apiFetch('/user/list');
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
          }
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchData();
  }, [apiFetch, authToken, currentUser?.role]);

  // Update cart & wishlist on login / user change
  useEffect(() => {
    if (currentUser) {
      if (currentUser.cart) setCart(normalizeCart(currentUser.cart));
      if (currentUser.wishlist) setWishlist(currentUser.wishlist);
    }
  }, [currentUser, currentUser?.email]);

  useEffect(() => {
    if (currentUser && !authToken) {
      setCurrentUser(null);
      setAdminSession(false);
      setCart([]);
      setWishlist([]);
    }
  }, [authToken, currentUser]);

  // Sync cart & wishlist to database when they change locally
  useEffect(() => {
    if (currentUser && currentUser.email && authToken) {
      const syncCartWishlist = async () => {
        try {
          await apiFetch('/user/sync', {
            method: 'PUT',
            body: JSON.stringify({
              email: currentUser.email,
              cart,
              wishlist
            })
          });
          await apiFetch('/wishlist', {
            method: 'PUT',
            body: JSON.stringify({ items: wishlist })
          });
        } catch (err) {
          console.error("Error syncing cart/wishlist to DB:", err);
        }
      };
      syncCartWishlist();
      
    }
  }, [apiFetch, authToken, cart, wishlist, currentUser, currentUser?.email]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [cart]
  );

  const promoState = useMemo(() => getPromoState(cartSubtotal, promoCode, offers), [cartSubtotal, promoCode, offers]);
  const shippingState = useMemo(() => getShippingState(cartSubtotal, shippingMethod), [cartSubtotal, shippingMethod]);
  const shippingAmount = promoState.code === 'FREESHIP' ? 0 : shippingState.amount;
  const orderTotal = Math.max(0, cartSubtotal - promoState.discount + shippingAmount);

  const addToCart = (product, selectedSize = 'M', selectedColor = 'Standard', selectedQty = 1) => {
    setCart((prev) => {
      const next = normalizeCart(prev);
      const existing = next.find(
        (item) => String(item.id) === String(product.id) && item.size === selectedSize && item.color === selectedColor
      );
      if (existing) {
        existing.quantity += Number(selectedQty);
      } else {
        next.push({
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price || 0),
          image: product.image,
          quantity: Number(selectedQty),
          size: selectedSize,
          color: selectedColor
        });
      }
      return next;
    });
  };

  const updateCartQuantity = (index, delta) => {
    setCart((prev) => {
      const next = normalizeCart(prev);
      if (!next[index]) return prev;
      next[index].quantity = Math.max(1, Number(next[index].quantity || 1) + delta);
      return next;
    });
  };

  const removeCartItem = (index) => {
    setCart((prev) => {
      const next = normalizeCart(prev);
      next.splice(index, 1);
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    setPromoCode('');
  };

  const createPaymentOrder = useCallback(async (notes = {}) => {
    try {
      const res = await apiFetch('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          amount: orderTotal,
          currency: 'INR',
          notes
        })
      });
      const data = await res.json();
      if (res.ok) return { ok: true, data };
      return { ok: false, message: data.message || 'Unable to start payment.' };
    } catch (err) {
      return { ok: false, message: 'Error connecting to payment server.' };
    }
  }, [apiFetch, orderTotal]);

  const verifyPayment = useCallback(async (payload) => {
    try {
      const res = await apiFetch('/payments/verify', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) return { ok: true, data };
      return { ok: false, message: data.message || 'Payment verification failed.' };
    } catch (err) {
      return { ok: false, message: 'Error verifying payment.' };
    }
  }, [apiFetch]);

  const placeOrder = async (deliveryAddress, paymentMethod, paymentDetails = {}) => {
    if (!cart.length) return null;
    
    try {
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.image
      }));
      const orderData = {
        customer: currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : 'Guest User',
        email: currentUser ? currentUser.email : 'guest@threadco.com',
        total: orderTotal,
        address: deliveryAddress || 'No Address Provided',
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentId: paymentDetails.paymentId || null,
        paymentStatus: paymentDetails.paymentStatus || (paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid'),
        razorpayPaymentId: paymentDetails.razorpayPaymentId || '',
        shippingMethod,
        shippingAmount,
        promoCode: promoState.code,
        discount: promoState.discount,
        items: orderItems
      };

      const res = await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      const savedOrder = await res.json();
      if (res.ok) {
        const savedItems = (savedOrder.items || []).map((savedItem) => {
          const sourceItem = orderItems.find((item) => String(item.id) === String(savedItem.id));
          return { ...savedItem, image: savedItem.image || sourceItem?.image || '' };
        });
        setOrders((prev) => [{ ...savedOrder, items: savedItems }, ...prev]);
        setCart([]);
        setPromoCode('');
        setShippingMethod('standard');
        return savedOrder.id;
      }
    } catch (err) {
      console.error("Error placing order:", err);
    }
    return null;
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      const updatedOrder = await res.json();
      if (res.ok) {
        setOrders((prev) =>
          prev.map((ord) => (String(ord.id) === String(orderId) ? updatedOrder : ord))
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Wishlist actions
  const addToWishlist = async (product) => {
    setWishlist((prev) => {
      if (prev.some((item) => String(item.id) === String(product.id))) return prev;
      return [...prev, product];
    });

    if (authToken) {
      try {
        await apiFetch('/wishlist', {
          method: 'POST',
          body: JSON.stringify(product)
        });
      } catch (err) {
        console.error("Error adding wishlist item:", err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));

    if (authToken) {
      try {
        await apiFetch(`/wishlist/${productId}`, {
          method: 'DELETE'
        });
      } catch (err) {
        console.error("Error removing wishlist item:", err);
      }
    }
  };

  const fetchReviews = useCallback(async (productId) => {
    try {
      const res = await apiFetch(`/reviews/${productId}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
    return [];
  }, [apiFetch]);

  const addReview = useCallback(async (productId, review) => {
    try {
      const res = await apiFetch(`/reviews/${productId}`, {
        method: 'POST',
        body: JSON.stringify(review)
      });
      const savedReview = await res.json();
      if (res.ok) return { ok: true, review: savedReview };
      return { ok: false, message: savedReview.message || 'Unable to save review.' };
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  }, [apiFetch]);

  const moveToCart = (product, selectedSize = 'M', selectedColor = 'Standard') => {
    addToCart(product, selectedSize, selectedColor, 1);
    removeFromWishlist(product.id);
  };

  // Profile actions
  const updateUserProfile = async (updatedDetails) => {
    if (!currentUser) return;
    try {
      const parts = (updatedDetails.name || '').trim().split(/\s+/);
      const firstname = parts[0] || currentUser.firstname || '';
      const lastname = parts.slice(1).join(' ') || currentUser.lastname || '';
      
      const res = await apiFetch('/user/profile', {
        method: 'PUT',
        body: JSON.stringify({
          email: currentUser.email,
          firstname,
          lastname,
          phone: updatedDetails.phone,
          addresses: updatedDetails.addresses
        })
      });
      const resData = await res.json();
      if (res.ok) {
        const updatedUser = resData.data;
        setCurrentUser(updatedUser);
        if (updatedUser.role === 'admin') {
          const usersRes = await apiFetch('/user/list');
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData);
          }
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Offers/Coupons actions
  const addOffer = async (offer) => {
    try {
      const res = await apiFetch('/offers', {
        method: 'POST',
        body: JSON.stringify(offer)
      });
      const savedOffer = await res.json();
      if (res.ok) {
        setOffers((prev) => [savedOffer, ...prev]);
        return { ok: true, offer: savedOffer };
      }
      return { ok: false, message: savedOffer.message || 'Unable to add offer.' };
    } catch (err) {
      console.error("Error adding offer:", err);
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const deleteOffer = async (code) => {
    try {
      const res = await apiFetch(`/offers/${code}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setOffers((prev) => prev.filter((o) => String(o.code).toUpperCase() !== String(code).toUpperCase()));
      }
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  const toggleOfferStatus = async (code) => {
    try {
      const res = await apiFetch(`/offers/${code}/toggle`, {
        method: 'PUT'
      });
      const updatedOffer = await res.json();
      if (res.ok) {
        setOffers((prev) =>
          prev.map((o) => (String(o.code).toUpperCase() === String(code).toUpperCase() ? updatedOffer : o))
        );
      }
    } catch (err) {
      console.error("Error toggling offer status:", err);
    }
  };

  const signup = async ({ name, email, password, phone, acceptedPolicies }) => {
    try {
      const res = await apiFetch('/user/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password, acceptedPolicies })
      });
      const data = await res.json();
      if (res.ok) {
        return { ok: true, message: 'Signup successful. Redirecting to login...' };
      } else {
        return { ok: false, message: data.message || 'Signup failed.' };
      }
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await apiFetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const resData = await res.json();
      if (res.ok) {
        const user = resData.data;
        setAuthToken(resData.token || '');
        setCurrentUser(user);
        setCart(normalizeCart(user.cart || []));
        setWishlist(user.wishlist || []);
        if (user.role === 'admin') setAdminSession(true);
        return { ok: true, isAdmin: user.role === 'admin', message: 'Login successful. Redirecting...' };
      } else {
        return { ok: false, message: resData.message || 'Invalid credentials.' };
      }
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const adminLogin = async ({ email, password }) => {
    try {
      const res = await apiFetch('/user/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const resData = await res.json();
      if (res.ok) {
        const user = resData.data;
        if (user.role !== 'admin') {
          return { ok: false, message: 'Invalid admin credentials.' };
        }
        setAuthToken(resData.token || '');
        setAdminSession(true);
        setCurrentUser(user);
        setCart(normalizeCart(user.cart || []));
        setWishlist(user.wishlist || []);
        return { ok: true, message: 'Admin access granted.' };
      } else {
        return { ok: false, message: resData.message || 'Invalid admin credentials.' };
      }
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const adminLogout = () => {
    setAdminSession(false);
    setAuthToken('');
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken('');
    setAdminSession(false);
    setCart([]);
    setWishlist([]);
  };

  const addProduct = async ({ name, category, price, image, rating = 4.0 }) => {
    try {
      const res = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify({ name, category, price, image, rating })
      });
      const savedProduct = await res.json();
      if (res.ok) {
        setProducts((prev) => [...prev, savedProduct]);
        return { ok: true, product: savedProduct };
      }
      return { ok: false, message: savedProduct.message || 'Unable to add product.' };
    } catch (err) {
      console.error("Error adding product:", err);
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const updateProductStock = async (productId, size, value) => {
    try {
      const res = await apiFetch(`/products/${productId}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ size, value })
      });
      const updatedProduct = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.map((prod) => (String(prod.id) === String(productId) ? updatedProduct : prod))
        );
        return { ok: true, product: updatedProduct };
      }
      return { ok: false, message: updatedProduct.message || 'Unable to update stock.' };
    } catch (err) {
      console.error("Error updating stock:", err);
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await apiFetch(`/products/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((product) => String(product.id) !== String(id)));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const submitContactMessage = async (messageData) => {
    try {
      const res = await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
      const data = await res.json();
      if (res.ok) return { ok: true, message: data.message || 'Message sent successfully.' };
      return { ok: false, message: data.message || 'Unable to save contact message.' };
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      const res = await apiFetch('/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) return { ok: true, message: data.message || 'Password reset request saved.' };
      return { ok: false, message: data.message || 'Unable to save password reset request.' };
    } catch (err) {
      return { ok: false, message: 'Error connecting to server.' };
    }
  };

  const value = {
    users,
    currentUser,
    adminSession,
    products,
    orders,
    cart,
    wishlist,
    offers,
    shippingMethod,
    promoCode,
    cartSubtotal,
    promoState,
    shippingState,
    shippingAmount,
    orderTotal,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    placeOrder,
    createPaymentOrder,
    verifyPayment,
    updateOrderStatus,
    setShippingMethod,
    setPromoCode,
    signup,
    login,
    adminLogin,
    adminLogout,
    logout,
    addProduct,
    updateProductStock,
    deleteProduct,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    fetchReviews,
    addReview,
    updateUserProfile,
    addOffer,
    deleteOffer,
    toggleOfferStatus,
    submitContactMessage,
    requestPasswordReset
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
};
