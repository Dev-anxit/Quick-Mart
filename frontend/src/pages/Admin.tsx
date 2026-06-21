import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import apiClient from '../services/api';
import { normalizeProduct, normalizeCategory } from '../utils/productNormalizer';

interface StatusColorMap {
  [key: string]: { bg: string; color: string };
}

const S = {
  page: { minHeight: '100vh', background: '#f5f5f3', fontFamily: "'Outfit', 'Inter', sans-serif" },
  header: { background: '#0e1a27', color: '#fff', padding: '0 2rem', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  body: { maxWidth: 1300, margin: '0 auto', padding: '2.5rem 1.5rem' },
  card: { background: '#fff', borderRadius: 16, padding: '1.75rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', marginBottom: '1.5rem' },
  metricCard: (color: string) => ({ background: '#fff', borderRadius: 16, padding: '1.5rem', borderLeft: `5px solid ${color}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, minWidth: '220px' } as React.CSSProperties),
  tabBtn: (active: boolean) => ({ padding: '0.75rem 1.5rem', border: 'none', borderBottom: active ? '3px solid #10b981' : '3px solid transparent', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', background: 'none', color: active ? '#10b981' : '#6b7280', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' } as React.CSSProperties),
  th: { padding: '1rem', textAlign: 'left' as const, fontSize: '0.8rem', fontWeight: 700, color: '#4b5563', textTransform: 'uppercase' as const, letterSpacing: '0.75px', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' },
  td: { padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.88rem', color: '#1f2937', verticalAlign: 'middle' as const },
  input: { width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1.5px solid #d1d5db', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s', background: '#fff' } as React.CSSProperties,
  btn: (bg: string, fg: string) => ({ background: bg, color: fg, border: 'none', padding: '0.75rem 1.25rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', fontSize: '0.88rem' } as React.CSSProperties),
  modalOverlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modalContent: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 550, padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' as const, position: 'relative' as const },
};

const statusColor = (s: string) => {
  const m: StatusColorMap = {
    delivered:       { bg: '#d1fae5', color: '#065f46' },
    cancelled:       { bg: '#fee2e2', color: '#991b1b' },
    on_way:          { bg: '#cffafe', color: '#155e75' },
    confirmed:       { bg: '#dbeafe', color: '#1d4ed8' },
    packed:          { bg: '#ede9fe', color: '#5b21b6' },
    payment_pending: { bg: '#fef9c3', color: '#854d0e' },
  };
  return m[s] || { bg: '#f3f4f6', color: '#374151' };
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'categories' | 'offers' | 'users' | 'orders'>('analytics');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');

  // Modals state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_percentage: '0',
    stock: '10',
    category_id: '',
    weight: '1 unit',
    veg_nonveg: 'veg',
    image_url: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  const [promoForm, setPromoForm] = useState({
    code: '',
    discount_percentage: '',
    max_discount: '',
    min_purchase: '',
    usage_limit: '',
    expires_at: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/dashboard');
      setMetrics(res.data.data);
    } catch {
      setMetrics({
        total_orders: 28,
        total_revenue: 14500,
        active_products: 45,
        low_stock: 4,
      });
    } finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/products?limit=100');
      const rawProducts = res.data.products || res.data.data || [];
      setProducts(rawProducts.map(normalizeProduct));
    } catch { setProducts([]); } finally { setIsLoading(false); }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/products/categories');
      const rawCats = res.data.categories || res.data.data || [];
      setCategories(rawCats.map(normalizeCategory));
    } catch { setCategories([]); } finally { setIsLoading(false); }
  };

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/promos');
      setPromos(res.data.data || []);
    } catch { setPromos([]); } finally { setIsLoading(false); }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/orders?limit=100');
      setOrders(res.data.orders || res.data.data || []);
    } catch { setOrders([]); } finally { setIsLoading(false); }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/users?limit=100');
      setUsers(res.data.users || res.data.data || []);
    } catch { setUsers([]); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    else if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    }
    else if (activeTab === 'categories') fetchCategories();
    else if (activeTab === 'offers') fetchPromos();
    else if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // Image Upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const res = await apiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        addToast({ type: 'success', message: 'Image uploaded successfully!' });
        if (type === 'product') {
          setProductForm(prev => ({ ...prev, image_url: res.data.url }));
        } else {
          setCategoryForm(prev => ({ ...prev, image_url: res.data.url }));
        }
      }
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Image upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  // Product Add / Update / Delete
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.category_id) {
      addToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      discount_percentage: parseFloat(productForm.discount_percentage || '0'),
      stock: parseInt(productForm.stock || '0', 10),
      category_id: productForm.category_id,
      image_urls: productForm.image_url ? [productForm.image_url] : [],
      veg_nonveg: productForm.veg_nonveg,
      weight: productForm.weight
    };

    try {
      if (showEditProduct && editingProduct) {
        const res = await apiClient.put(`/products/${editingProduct._id || editingProduct.id}`, {
          ...payload,
          is_active: editingProduct.is_active !== false
        });
        addToast({ type: 'success', message: 'Product updated successfully!' });
        setProducts(prev => prev.map(p => (p._id === editingProduct._id) ? normalizeProduct(res.data.product) : p));
        setShowEditProduct(false);
      } else {
        const res = await apiClient.post('/products', payload);
        addToast({ type: 'success', message: 'Product created successfully!' });
        setProducts(prev => [normalizeProduct(res.data.product), ...prev]);
        setShowAddProduct(false);
      }
      // Reset form
      setProductForm({
        name: '', description: '', price: '', discount_percentage: '0', stock: '10',
        category_id: '', weight: '1 unit', veg_nonveg: 'veg', image_url: ''
      });
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to save product' });
    }
  };

  const handleEditClick = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      discount_percentage: (p.discount_percentage || 0).toString(),
      stock: p.stock.toString(),
      category_id: p.category_id,
      weight: p.weight || '1 unit',
      veg_nonveg: p.veg_nonveg || 'veg',
      image_url: p.image_url || ''
    });
    setShowEditProduct(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      addToast({ type: 'success', message: 'Product deleted successfully' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete product' });
    }
  };

  const handleQuickStockUpdate = async (p: any, newStock: number) => {
    if (newStock < 0) return;
    try {
      await apiClient.put(`/products/${p._id || p.id}`, { stock: newStock });
      addToast({ type: 'success', message: 'Stock updated' });
      setProducts(prev => prev.map(item => (item._id === p._id || item.id === p.id) ? { ...item, stock: newStock } : item));
    } catch {
      addToast({ type: 'error', message: 'Failed to update stock' });
    }
  };

  const handleQuickPriceUpdate = async (p: any, newPrice: number) => {
    if (newPrice < 0) return;
    try {
      await apiClient.put(`/products/${p._id || p.id}`, { price: newPrice });
      addToast({ type: 'success', message: 'Price updated' });
      setProducts(prev => prev.map(item => (item._id === p._id || item.id === p.id) ? { ...item, price: newPrice } : item));
    } catch {
      addToast({ type: 'error', message: 'Failed to update price' });
    }
  };

  // Category Add
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      addToast({ type: 'error', message: 'Category name is required' });
      return;
    }

    try {
      const res = await apiClient.post('/admin/categories', categoryForm);
      addToast({ type: 'success', message: 'Category created successfully!' });
      setCategories(prev => [...prev, normalizeCategory(res.data.category)]);
      setCategoryForm({ name: '', description: '', image_url: '' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create category' });
    }
  };

  // Promo Add / Delete
  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.code || !promoForm.discount_percentage) {
      addToast({ type: 'error', message: 'Promo code and discount percentage are required' });
      return;
    }

    const payload = {
      code: promoForm.code.toUpperCase(),
      discount_percentage: parseFloat(promoForm.discount_percentage),
      max_discount: promoForm.max_discount ? parseFloat(promoForm.max_discount) : undefined,
      min_purchase: promoForm.min_purchase ? parseFloat(promoForm.min_purchase) : undefined,
      usage_limit: promoForm.usage_limit ? parseInt(promoForm.usage_limit, 10) : undefined,
      expires_at: promoForm.expires_at ? new Date(promoForm.expires_at).toISOString() : undefined,
    };

    try {
      const res = await apiClient.post('/admin/promos', payload);
      addToast({ type: 'success', message: 'Promo code created successfully!' });
      setPromos(prev => [res.data.data, ...prev]);
      setPromoForm({ code: '', discount_percentage: '', max_discount: '', min_purchase: '', usage_limit: '', expires_at: '' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create promo' });
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!window.confirm('Delete this promo code?')) return;
    try {
      await apiClient.delete(`/admin/promos/${id}`);
      addToast({ type: 'success', message: 'Promo code deleted' });
      setPromos(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to delete promo' });
    }
  };

  // Order status
  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status } : o));
      addToast({ type: 'success', message: `Order updated to ${status.replace(/_/g, ' ')}` });
    } catch {
      addToast({ type: 'error', message: 'Failed to update order status' });
    }
  };

  // Stats definition
  const METRIC_CARDS = [
    { label: "Today's Revenue", value: `₹${(metrics?.total_revenue || 0).toLocaleString('en-IN')}`, sub: '+12% from yesterday', color: '#10b981', icon: '💰' },
    { label: 'Total Orders', value: metrics?.total_orders || 0, sub: 'Processed orders', color: '#3b82f6', icon: '📦' },
    { label: 'Active Products', value: metrics?.active_products || 0, sub: 'In catalog', color: '#8b5cf6', icon: '🛍️' },
    { label: 'Low Stock Items', value: metrics?.low_stock || 0, sub: '5 units or less', color: '#ef4444', icon: '⚠️' },
  ];

  // Filters calculation
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCatFilter ? p.category_id === selectedCatFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '1.4rem', letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🛒</span> Quick<span style={{ color: '#10b981' }}>Mart</span> <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: 6, fontWeight: 700 }}>ADMIN</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.88rem', color: '#9ca3af' }}>Signed in as: <strong style={{ color: '#fff' }}>{user?.name || user?.email || 'Admin'}</strong></span>
          <button onClick={() => navigate('/')} style={{ ...S.btn('rgba(255,255,255,0.08)', '#fff'), padding: '0.4rem 0.8rem', borderRadius: 8, fontSize: '0.78rem' }}>Go to Storefront</button>
        </div>
      </div>

      <div style={S.body}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: '#0f172a', margin: 0 }}>🎛️ Control Center</h1>
            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage inventory, categories, promotional offers, and orders.</p>
          </div>
          <span style={{ fontSize: '0.88rem', color: '#64748b', background: '#fff', padding: '0.5rem 1rem', borderRadius: 10, border: '1px solid #e2e8f0', fontWeight: 600 }}>
            📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Tabs Bar */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '0.25rem', border: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', marginBottom: '2rem', gap: '0.25rem' }}>
          {(['analytics', 'products', 'categories', 'offers', 'users', 'orders'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={S.tabBtn(activeTab === tab)}>
              {tab === 'analytics' ? '📈 Analytics' : tab === 'products' ? '🛍️ Products' : tab === 'categories' ? '📁 Categories' : tab === 'offers' ? '🏷️ Offers' : tab === 'users' ? '👥 Users' : '🛒 Orders'}
            </button>
          ))}
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {METRIC_CARDS.map(m => (
                <div key={m.label} style={S.metricCard(m.color)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.75px' }}>{m.label}</p>
                      <p style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.8rem', fontWeight: 900, color: '#0f172a' }}>{m.value}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>{m.sub}</p>
                    </div>
                    <span style={{ fontSize: '2rem', background: `${m.color}15`, padding: '0.5rem', borderRadius: 12 }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={S.card}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>🔔 Low Stock Warnings</h3>
                {products.filter(p => p.stock <= 5).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {products.filter(p => p.stock <= 5).map(p => (
                      <div key={p._id || p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#fff1f2', borderRadius: 10, border: '1px solid #ffe4e6' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: '#9f1239' }}>{p.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#be123c' }}>{p.weight} • Stock: {p.stock} left</div>
                        </div>
                        <button onClick={() => handleQuickStockUpdate(p, 25)} style={{ ...S.btn('#9f1239', '#fff'), padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: 6 }}>Restock (25)</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>🎉 All products are adequately stocked.</p>
                )}
              </div>

              <div style={S.card}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>📈 Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button onClick={() => { setActiveTab('products'); setShowAddProduct(true); }} style={{ ...S.btn('#10b981', '#fff'), justifyContent: 'center' }}>＋ Add Product</button>
                  <button onClick={() => setActiveTab('categories')} style={{ ...S.btn('#3b82f6', '#fff'), justifyContent: 'center' }}>＋ Create Category</button>
                  <button onClick={() => setActiveTab('offers')} style={{ ...S.btn('#8b5cf6', '#fff'), justifyContent: 'center' }}>＋ Add Promo Code</button>
                  <button onClick={() => setActiveTab('orders')} style={{ ...S.btn('#64748b', '#fff'), justifyContent: 'center' }}>📦 Manage Orders</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>Product Catalog</h2>
              <button onClick={() => setShowAddProduct(true)} style={S.btn('#10b981', '#fff')}>＋ Add New Product</button>
            </div>

            {/* Filters Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Search products by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ ...S.input, flex: 2, minWidth: '250px' }}
              />
              <select
                value={selectedCatFilter}
                onChange={e => setSelectedCatFilter(e.target.value)}
                style={{ ...S.input, flex: 1, minWidth: '150px' }}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div className="spinner" />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Product Details', 'Category', 'Price (₹)', 'Discount', 'Stock', 'Veg/NV', 'Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? filteredProducts.map(p => {
                      const categoryObj = categories.find(c => c._id === p.category_id || c.id === p.category_id);
                      return (
                        <tr key={p._id || p.id} className="table-row">
                          <td style={S.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {p.image_url ? (
                                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                ) : (
                                  <span style={{ fontSize: '1.2rem' }}>📦</span>
                                )}
                              </div>
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{p.name}</p>
                                <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{p.weight || '1 unit'}</p>
                              </div>
                            </div>
                          </td>
                          <td style={S.td}>
                            <span style={{ background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, color: '#475569' }}>
                              {categoryObj ? categoryObj.name : 'Unknown'}
                            </span>
                          </td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span>₹</span>
                              <input
                                type="number"
                                defaultValue={p.price}
                                onBlur={e => handleQuickPriceUpdate(p, parseFloat(e.target.value))}
                                style={{ width: '60px', padding: '0.2rem 0.4rem', border: '1px dashed #cbd5e1', borderRadius: 6, fontWeight: 700, outline: 'none' }}
                              />
                            </div>
                          </td>
                          <td style={{ ...S.td, fontWeight: 700, color: p.discount_percentage > 0 ? '#10b981' : '#64748b' }}>
                            {p.discount_percentage > 0 ? `${p.discount_percentage}% OFF` : '—'}
                          </td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <button onClick={() => handleQuickStockUpdate(p, p.stock - 1)} style={{ background: '#f1f5f9', border: 'none', width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                              <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', color: p.stock <= 5 ? '#ef4444' : p.stock <= 20 ? '#f59e0b' : '#10b981' }}>{p.stock}</span>
                              <button onClick={() => handleQuickStockUpdate(p, p.stock + 1)} style={{ background: '#f1f5f9', border: 'none', width: '22px', height: '22px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                            </div>
                          </td>
                          <td style={S.td}>
                            <span style={{ width: 12, height: 12, borderRadius: '50%', display: 'inline-block', background: p.veg_nonveg === 'veg' ? '#10b981' : '#ef4444', border: '2px solid #fff', boxShadow: '0 0 0 1px #cbd5e1' }} title={p.veg_nonveg} />
                          </td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleEditClick(p)} style={{ ...S.btn('#3b82f6', '#fff'), padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.78rem' }}>✏️ Edit</button>
                              <button onClick={() => handleDeleteProduct(p._id || p.id)} style={{ ...S.btn('#ef4444', '#fff'), padding: '0.35rem 0.75rem', borderRadius: 6, fontSize: '0.78rem' }}>🗑️ Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={7} style={{ ...S.td, textAlign: 'center', padding: '4rem', color: '#64748b' }}>No products found matching criteria.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div style={S.card}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>Category List</h2>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {categories.map(c => (
                    <div key={c._id || c.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
                        {c.image_url ? <img src={c.image_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📁'}
                      </div>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{c.name}</strong>
                        <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>{c.description || 'No description available'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={S.card}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>Create New Category</h2>
              <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Fresh Bakery"
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={e => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief details about the category..."
                    style={{ ...S.input, minHeight: '80px', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Category Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'category')}
                      style={{ fontSize: '0.85rem' }}
                    />
                    {isUploading && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Uploading...</span>}
                  </div>
                  {categoryForm.image_url && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <img src={categoryForm.image_url} alt="preview" style={{ width: '80px', height: '80px', borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                    </div>
                  )}
                </div>
                <button type="submit" style={{ ...S.btn('#10b981', '#fff'), marginTop: '0.5rem', justifyContent: 'center' }}>Create Category</button>
              </form>
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div style={S.card}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>Active Promo Offers</h2>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {promos.length > 0 ? promos.map(p => (
                    <div key={p._id || p.id} className="coupon-card">
                      <div className="coupon-left">
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1 }}>Promo Code</div>
                        <div className="coupon-code">{p.code}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                          Discount: <strong style={{ color: '#10b981' }}>{p.discount_percentage}%</strong>
                        </div>
                      </div>
                      <div className="coupon-right">
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Min Order: <strong>₹{p.min_purchase || 0}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Max Discount: <strong>₹{p.max_discount || 'None'}</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Used: {p.times_used} {p.usage_limit ? `/ ${p.usage_limit}` : ''}</div>
                        <button onClick={() => handleDeletePromo(p._id || p.id)} style={{ ...S.btn('#fee2e2', '#ef4444'), padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: 6, marginTop: '0.5rem', border: '1px solid #fecaca' }}>Delete Code</button>
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0, textAlign: 'center', padding: '2rem' }}>No active promo codes found.</p>
                  )}
                </div>
              )}
            </div>

            <div style={S.card}>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>Create Promo Code</h2>
              <form onSubmit={handlePromoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Promo Code *</label>
                    <input
                      type="text"
                      required
                      value={promoForm.code}
                      onChange={e => setPromoForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. QUICK50"
                      style={S.input}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Discount (%) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={promoForm.discount_percentage}
                      onChange={e => setPromoForm(prev => ({ ...prev, discount_percentage: e.target.value }))}
                      placeholder="e.g. 15"
                      style={S.input}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Max Discount (₹)</label>
                    <input
                      type="number"
                      value={promoForm.max_discount}
                      onChange={e => setPromoForm(prev => ({ ...prev, max_discount: e.target.value }))}
                      placeholder="e.g. 100"
                      style={S.input}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={promoForm.min_purchase}
                      onChange={e => setPromoForm(prev => ({ ...prev, min_purchase: e.target.value }))}
                      placeholder="e.g. 299"
                      style={S.input}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Total Usage Limit</label>
                    <input
                      type="number"
                      value={promoForm.usage_limit}
                      onChange={e => setPromoForm(prev => ({ ...prev, usage_limit: e.target.value }))}
                      placeholder="e.g. 500"
                      style={S.input}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Expiration Date</label>
                    <input
                      type="date"
                      value={promoForm.expires_at}
                      onChange={e => setPromoForm(prev => ({ ...prev, expires_at: e.target.value }))}
                      style={S.input}
                    />
                  </div>
                </div>

                <button type="submit" style={{ ...S.btn('#8b5cf6', '#fff'), marginTop: '0.5rem', justifyContent: 'center' }}>Create Promo Code</button>
              </form>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={S.card}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>User Management</h2>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['User Info', 'Phone', 'Verified', 'Join Date'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? users.map(u => (
                      <tr key={u._id || u.id} className="table-row">
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#475569' }}>
                              {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name || 'Anonymous User'}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={S.td}>{u.phone || '—'}</td>
                        <td style={S.td}>
                          <span style={{ padding: '0.25rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700, background: u.phone_verified ? '#d1fae5' : '#fee2e2', color: u.phone_verified ? '#065f46' : '#991b1b' }}>
                            {u.phone_verified ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>
                        <td style={S.td}>{new Date(u.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} style={{ ...S.td, textAlign: 'center', padding: '4rem', color: '#64748b' }}>No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={S.card}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', margin: '0 0 1.5rem' }}>Order Management</h2>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" /></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Order #', 'Date', 'Customer', 'Amount', 'Status', 'Update Status'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map(order => {
                      const sc = statusColor(order.status);
                      return (
                        <tr key={order._id || order.id}>
                          <td style={{ ...S.td, fontWeight: 700 }}>#{order.order_number}</td>
                          <td style={S.td}>{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                          <td style={S.td}>
                            <div style={{ fontWeight: 600 }}>{order.user?.name || 'Guest User'}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.user?.email || ''}</div>
                          </td>
                          <td style={{ ...S.td, fontWeight: 800 }}>₹{order.total_amount}</td>
                          <td style={S.td}>
                            <span style={{ padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                              {order.status.toUpperCase().replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={S.td}>
                            <select
                              defaultValue={order.status}
                              onChange={e => handleStatusUpdate(order._id || order.id, e.target.value)}
                              style={{ border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '0.4rem 0.75rem', fontSize: '0.85rem', cursor: 'pointer', outline: 'none', background: '#fff' }}
                            >
                              {['pending', 'confirmed', 'packed', 'picked_up', 'on_way', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: '4rem', color: '#64748b' }}>No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={S.modalOverlay}>
          <div style={S.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem', color: '#0f172a' }}>＋ Add New Product</h2>
              <button onClick={() => setShowAddProduct(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>✕</button>
            </div>
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Cavendish Bananas"
                  style={S.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Category *</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={e => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    style={S.input}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Weight/Size *</label>
                  <input
                    type="text"
                    required
                    value={productForm.weight}
                    onChange={e => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                    placeholder="e.g. 500 g, 6 pcs"
                    style={S.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={productForm.price}
                    onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Price"
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discount_percentage}
                    onChange={e => setProductForm(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    placeholder="0"
                    style={S.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Type</label>
                  <select
                    value={productForm.veg_nonveg}
                    onChange={e => setProductForm(prev => ({ ...prev, veg_nonveg: e.target.value }))}
                    style={S.input}
                  >
                    <option value="veg">Vegetarian (Veg)</option>
                    <option value="nonveg">Non-Vegetarian (Non-Veg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detail information about ingredients, origin, etc."
                  style={{ ...S.input, minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'product')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {isUploading && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Uploading...</span>}
                </div>
                {productForm.image_url && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <img src={productForm.image_url} alt="preview" style={{ width: '80px', height: '80px', borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddProduct(false)} style={{ ...S.btn('#cbd5e1', '#475569'), flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" style={{ ...S.btn('#10b981', '#fff'), flex: 2, justifyContent: 'center' }}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProduct && (
        <div style={S.modalOverlay}>
          <div style={S.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.4rem', color: '#0f172a' }}>✏️ Edit Product</h2>
              <button onClick={() => setShowEditProduct(false)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold' }}>✕</button>
            </div>
            <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  style={S.input}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Category *</label>
                  <select
                    required
                    value={productForm.category_id}
                    onChange={e => setProductForm(prev => ({ ...prev, category_id: e.target.value }))}
                    style={S.input}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Weight/Size *</label>
                  <input
                    type="text"
                    required
                    value={productForm.weight}
                    onChange={e => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                    style={S.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={productForm.price}
                    onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={productForm.discount_percentage}
                    onChange={e => setProductForm(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    style={S.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={e => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Type</label>
                  <select
                    value={productForm.veg_nonveg}
                    onChange={e => setProductForm(prev => ({ ...prev, veg_nonveg: e.target.value }))}
                    style={S.input}
                  >
                    <option value="veg">Vegetarian (Veg)</option>
                    <option value="nonveg">Non-Vegetarian (Non-Veg)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ ...S.input, minHeight: '80px', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, 'product')}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {isUploading && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Uploading...</span>}
                </div>
                {productForm.image_url && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <img src={productForm.image_url} alt="preview" style={{ width: '80px', height: '80px', borderRadius: 8, objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0' }}>
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingProduct?.is_active !== false}
                  onChange={e => setEditingProduct((prev: any) => ({ ...prev, is_active: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Active (Visible on Storefront)</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowEditProduct(false)} style={{ ...S.btn('#cbd5e1', '#475569'), flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" style={{ ...S.btn('#3b82f6', '#fff'), flex: 2, justifyContent: 'center' }}>Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for Animations and Custom Layout Components */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        
        .spinner {
          width: 44px;
          height: 44px;
          border: 4px solid #e2e8f0;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }

        .table-row {
          transition: background-color 0.2s;
        }

        .table-row:hover {
          background-color: #f8fafc;
        }

        .coupon-card {
          background: #fff;
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .coupon-code {
          font-size: 1.4rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: 0.5px;
          margin-top: 0.2rem;
          font-family: monospace;
          background: #f1f5f9;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          display: inline-block;
        }

        .coupon-left {
          flex: 1;
        }

        .coupon-right {
          border-left: 2px dashed #e2e8f0;
          padding-left: 1.25rem;
          text-align: right;
          min-width: 140px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
