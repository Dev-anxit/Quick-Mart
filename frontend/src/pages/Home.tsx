import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../store/cartStore';
import { useUIStore } from '../store/uiStore';
import { ProductCard } from '../components/product/ProductCard';
import productService from '../services/productService';
import type { ProductResponse, CategoryResponse } from '../types/api';
import apiClient from '../services/api';

import '../Home.css';

// ── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ onClose }: { onClose: () => void }) {
  const { items, updateQuantity, appliedPromo, applyPromo, removePromo } = useCartStore();
  const { addToast } = useUIStore();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = appliedPromo
    ? appliedPromo.discount_type === 'percentage'
      ? Math.round(subtotal * appliedPromo.discount_value / 100)
      : appliedPromo.discount_value
    : 0;
  const deliveryFee = subtotal > 299 ? 0 : 30;
  const platformFee = Math.round(subtotal * 0.03);
  const grandTotal = subtotal - discount + deliveryFee + platformFee;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const response = await apiClient.post('/promos/validate', {
        code: promoCode.toUpperCase(),
      });
      const data = response.data;
      if (data.success && data.data) {
        applyPromo(data.data);
        addToast({ type: 'success', message: `Promo applied! You save ₹${data.data.discount_value}` });
      } else {
        addToast({ type: 'error', message: data.message || 'Invalid promo code' });
      }
    } catch {
      // Offline-friendly fallback promos
      const LOCAL_PROMOS: Record<string, any> = {
        WELCOME10: { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10 },
        FRESH20:   { code: 'FRESH20',   discount_type: 'percentage', discount_value: 20 },
        FLAT50:    { code: 'FLAT50',    discount_type: 'fixed',      discount_value: 50  },
      };
      const found = LOCAL_PROMOS[promoCode.toUpperCase()];
      if (found) {
        applyPromo(found);
        addToast({ type: 'success', message: `Promo applied!` });
      } else {
        addToast({ type: 'error', message: 'Invalid promo code' });
      }
    }
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <span className="cart-drawer-title">🛒 Your Cart</span>
          <button className="cart-close-btn" onClick={onClose}>✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map(item => (
                <div key={item.product_id} className="cart-item">
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="cart-item-img" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                    : <div className="cart-item-img" style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🛍️</div>
                  }
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price} each</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              {/* Promo */}
              <div className="cart-promo-row">
                {appliedPromo ? (
                  <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f0fdf9', borderRadius:8, padding:'0.5rem 0.875rem', border:'1.5px solid #0d9e6e' }}>
                    <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#0d9e6e' }}>🎉 {appliedPromo.code} applied!</span>
                    <button onClick={removePromo} style={{ background:'none', border:'none', color:'#888', cursor:'pointer', fontSize:'0.85rem', fontWeight:600 }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <input className="cart-promo-input" placeholder="Enter promo code (e.g. FLAT50)" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                    <button className="cart-promo-btn" onClick={handleApplyPromo}>Apply</button>
                  </>
                )}
              </div>

              {/* Bill */}
              <div className="cart-bill-details">
                <div className="cart-bill-row"><span>Item total</span><span>₹{subtotal}</span></div>
                {discount > 0 && <div className="cart-bill-row green"><span>Promo discount</span><span>-₹{discount}</span></div>}
                <div className="cart-bill-row"><span>Delivery fee</span><span>{deliveryFee === 0 ? <span style={{ color:'#0d9e6e' }}>FREE</span> : `₹${deliveryFee}`}</span></div>
                <div className="cart-bill-row"><span>Platform fee</span><span>₹{platformFee}</span></div>
                <div className="cart-bill-row total"><span>To pay</span><span>₹{grandTotal}</span></div>
              </div>

              {subtotal < 299 && (
                <p style={{ fontSize:'0.78rem', color:'#e87c2b', fontWeight:600, marginBottom:'0.75rem', textAlign:'center' }}>
                  🚚 Add ₹{299 - subtotal} more for free delivery!
                </p>
              )}

              <button className="cart-checkout-btn" onClick={() => { onClose(); navigate('/checkout'); }}>
                Proceed to Checkout → ₹{grandTotal}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);

  const items = useCartStore(s => s.items);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    productService.getCategories()
      .then(setCategories)
      .catch(err => {
        console.error('Failed to fetch categories:', err);
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    productService.getProducts({ category: selectedCategory || undefined, page: 1, limit: 40 })
      .then(r => setProducts(r.data || []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  const filtered = search.trim()
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0' }}>
      {/* Header */}
      <header className="qm-header">
        <div className="qm-header-inner">
          <a href="/" className="qm-logo">Quick<span>Mart</span></a>
          <div className="qm-location">
            <div className="qm-location-dot" />
            Delivering in <strong style={{ marginLeft:4 }}>10 mins</strong>
          </div>
          <div className="qm-search-bar">
            <span className="qm-search-icon">🔍</span>
            <input
              placeholder='Search "milk", "bananas"...'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="qm-qm-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => {
                if (!isLoggedIn) {
                  useUIStore.getState().addToast({ type: 'info', message: 'Please login to access your account' });
                  useUIStore.getState().setAuthModalOpen(true);
                } else {
                  navigate('/account');
                }
              }} 
              className="qm-account-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', display: 'flex', alignItems: 'center', color: '#374151', fontWeight: 600 }}
            >
              👤 Account
            </button>
            <button className="qm-cart-btn" onClick={() => setCartOpen(true)}>
              🛒
              {totalItems > 0 && <span className="qm-cart-badge">{totalItems}</span>}
              Cart
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-dot" />
              Express Delivery Active
            </div>
            <h1 className="hero-title">
              Groceries in
              <span className="hero-title-green">10 Minutes.</span>
            </h1>
            <p className="hero-subtitle">
              Fresh produce, dairy, snacks, and 5000+ products — delivered to your door faster than you can find your keys.
            </p>
            <div className="hero-cta-row">
              <button className="hero-cta-btn" onClick={() => document.querySelector('.qm-main')?.scrollIntoView({ behavior: 'smooth' })}>
                Shop Now →
              </button>
            </div>
            <div className="hero-stat-row">
              <div className="hero-stat"><div className="hero-stat-number">5000+</div><div className="hero-stat-label">Products</div></div>
              <div className="hero-stat"><div className="hero-stat-number">10 min</div><div className="hero-stat-label">Avg. Delivery</div></div>
              <div className="hero-stat"><div className="hero-stat-number">4.9 ★</div><div className="hero-stat-label">App Rating</div></div>
            </div>
          </div>
          <div className="hero-image-col">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80" alt="Fresh groceries" />
          </div>
        </div>
      </section>

      {/* Deals Strip */}
      <div className="deals-strip">
        <div className="deals-strip-inner">
          {[
            { icon: '🎉', text: 'Use code WELCOME10 for 10% off' },
            { icon: '🥦', text: 'FRESH20 — 20% off vegetables' },
            { icon: '🚚', text: 'Free delivery above ₹299' },
            { icon: '💳', text: 'FLAT50 — ₹50 off above ₹599' },
            { icon: '⭐', text: 'Rated 4.9 by 1M+ customers' },
          ].map((d, i) => (
            <div key={i} className="deal-chip">
              <span className="deal-chip-icon">{d.icon}</span>
              {d.text}
              {i < 4 && <span style={{ color:'#ccc', marginLeft:8 }}>|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Category Nav */}
      <nav className="cat-nav">
        <div className="cat-nav-inner">
          <button onClick={() => setSelectedCategory(null)} className={`cat-pill ${selectedCategory === null ? 'active' : ''}`}>
            🛍️ All
          </button>
          {categories.map(cat => {
            const catId = cat._id || cat.id || '';
            return (
              <button key={catId} onClick={() => setSelectedCategory(catId)} className={`cat-pill ${selectedCategory === catId ? 'active' : ''}`}>
                {cat.icon_url || cat.image_url ? (
                  <>
                    <img src={cat.icon_url || cat.image_url} alt={cat.name} style={{ width: '20px', height: '20px', display: 'inline' }} />
                    {' '}{cat.name}
                  </>
                ) : (
                  `🛒 ${cat.name}`
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="qm-main">
        <h2 className="section-title">
          {selectedCategory ? categories.find(c => c._id === selectedCategory)?.name : 'All Products'}
          {filtered.length > 0 && <span style={{ fontWeight:400, color:'#888', fontSize:'0.9rem', marginLeft:'0.5rem' }}>({filtered.length} items)</span>}
        </h2>

        {isLoading ? (
          <div className="product-grid">
            {[...Array(10)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280 }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p._id} product={p} onCartOpen={() => setCartOpen(true)} />)}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>No products found</h3>
            <p>Try another category or search term.</p>
          </div>
        )}
      </main>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div className="bottom-cart-bar">
          <div className="bottom-cart-bar-inner" onClick={() => setCartOpen(true)}>
            <div className="bcb-left">
              <span className="bcb-count">{totalItems} item{totalItems > 1 ? 's' : ''} added</span>
              <span className="bcb-label">View Cart</span>
            </div>
            <div className="bcb-right">
              <span className="bcb-total">₹{subtotal}</span>
              <span className="bcb-arrow">→</span>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
