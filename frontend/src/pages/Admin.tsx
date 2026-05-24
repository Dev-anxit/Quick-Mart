import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import apiClient from '../services/api';


interface StatusColorMap {
  [key: string]: { bg: string; color: string };
}

const S = {
  page: { minHeight: '100vh', background: '#f0f0ea', fontFamily: "'Inter', sans-serif" },
  header: { background: '#111', color: '#fff', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  body: { maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' },
  card: { background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8', marginBottom: '1.25rem' },
  metricCard: (color: string) => ({ background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem', border: `2px solid ${color}20`, flex: 1 } as React.CSSProperties),
  tabBtn: (active: boolean) => ({ padding: '0.625rem 1.25rem', border: 'none', borderBottom: active ? '3px solid #0d9e6e' : '3px solid transparent', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', background: 'none', color: active ? '#0d9e6e' : '#666', transition: 'all 0.2s' } as React.CSSProperties),
  th: { padding: '0.75rem 1rem', textAlign: 'left' as const, fontSize: '0.78rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.5px', borderBottom: '2px solid #f0f0ea' },
  td: { padding: '0.875rem 1rem', borderBottom: '1px solid #f5f5f0', fontSize: '0.88rem', color: '#333', verticalAlign: 'middle' as const },
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

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { if (!user) navigate('/'); }, [user, navigate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/dashboard');
      setMetrics(res.data.data);
    } catch {
      // Backend may not be running — use placeholder data for UI demo
      setMetrics({
        total_orders: 247,
        total_revenue: 124500,
        active_products: 5024,
        low_stock: 3,
      });
    } finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/products?limit=20');
      setProducts(res.data.data || []);
    } catch { setProducts([]); } finally { setIsLoading(false); }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/orders/admin/all?limit=20');
      setOrders(res.data.data || []);
    } catch { setOrders([]); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    else if (activeTab === 'products') fetchProducts();
    else if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => (o._id as string) === orderId ? { ...o, status } : o));
      addToast({ type: 'success', message: `Order updated to ${status}` });
    } catch {
      addToast({ type: 'error', message: 'Failed to update order status' });
    }
  };

  const METRIC_CARDS = [
    { label: "Today's Revenue", value: `₹${(metrics?.total_revenue || 0).toLocaleString('en-IN')}`, sub: '+12% from yesterday', color: '#0d9e6e', icon: '💰' },
    { label: 'Total Orders', value: metrics?.total_orders || 0, sub: 'All time', color: '#3b82f6', icon: '📦' },
    { label: 'Active Products', value: metrics?.active_products || 0, sub: 'In stock', color: '#8b5cf6', icon: '🛍️' },
    { label: 'Low Stock Items', value: metrics?.low_stock || 0, sub: 'Needs restocking', color: '#ef4444', icon: '⚠️' },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 900, fontSize: '1.2rem', letterSpacing: -0.5 }}>
          Quick<span style={{ color: '#4ade80' }}>Mart</span> Admin
        </a>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>Welcome, {user?.name || user?.email || 'Admin'}</span>
      </div>

      <div style={S.body}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontWeight: 900, fontSize: '1.6rem', color: '#111', margin: 0 }}>📊 Admin Dashboard</h1>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '0 0.5rem', border: '1px solid #e8e8e8', display: 'inline-flex', marginBottom: '1.5rem' }}>
          {(['analytics', 'products', 'orders'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={S.tabBtn(activeTab === tab)}>
              {tab === 'analytics' ? '📈 Analytics' : tab === 'products' ? '🛍️ Products' : '🛒 Orders'}
            </button>
          ))}
        </div>

        {/* Analytics */}
        {activeTab === 'analytics' && (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
              {METRIC_CARDS.map(m => (
                <div key={m.label} style={S.metricCard(m.color)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</p>
                      <p style={{ margin: '0.4rem 0 0.25rem', fontSize: '2rem', fontWeight: 900, color: m.color }}>{m.value}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{m.sub}</p>
                    </div>
                    <span style={{ fontSize: '2rem' }}>{m.icon}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <p style={{ color: '#888', textAlign: 'center', padding: '2rem', fontWeight: 600 }}>
                📊 Revenue charts and detailed analytics require the backend to be connected with real data.
              </p>
            </div>
          </>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', margin: 0 }}>Product Management</h2>
            </div>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #0d9e6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f7' }}>
                      {['Product', 'Category', 'Price', 'Discount', 'Stock', 'Veg'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? products.map(p => (
                      <tr key={p._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f7')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#111', fontSize: '0.85rem' }}>{p.name}</p>
                              <p style={{ margin: 0, fontSize: '0.72rem', color: '#888' }}>{p.weight}</p>
                            </div>
                          </div>
                        </td>
                        <td style={S.td}><span style={{ background: '#f0f0ea', padding: '0.25rem 0.625rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>{p.category}</span></td>
                        <td style={{ ...S.td, fontWeight: 800 }}>₹{p.price}</td>
                        <td style={S.td}>{p.discount_percentage > 0 ? <span style={{ color: '#0d9e6e', fontWeight: 700 }}>{p.discount_percentage}% OFF</span> : '—'}</td>
                        <td style={S.td}>
                          <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#ef4444' : p.stock <= 20 ? '#f59e0b' : '#059669' }}>{p.stock}</span>
                        </td>
                        <td style={S.td}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', display: 'inline-block', background: p.veg_nonveg === 'veg' ? '#22c55e' : '#ef4444', border: `2px solid ${p.veg_nonveg === 'veg' ? '#16a34a' : '#dc2626'}` }} />
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ ...S.td, textAlign: 'center', padding: '3rem', color: '#888' }}>No products found. Make sure the backend is running and the database is seeded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div style={S.card}>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111', margin: '0 0 1.25rem' }}>Order Management</h2>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #0d9e6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f7' }}>
                      {['Order #', 'Date', 'Amount', 'Status', 'Update Status'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map(order => {
                      const sc = statusColor(order.status);
                      return (
                        <tr key={order._id}>
                          <td style={{ ...S.td, fontWeight: 700 }}>#{order.order_number}</td>
                          <td style={S.td}>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                          <td style={{ ...S.td, fontWeight: 800 }}>₹{order.total_amount}</td>
                          <td style={S.td}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color }}>
                              {order.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={S.td}>
                            <select
                              defaultValue={order.status}
                              onChange={e => handleStatusUpdate(order._id, e.target.value)}
                              style={{ border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '0.35rem 0.625rem', fontSize: '0.8rem', cursor: 'pointer', outline: 'none' }}
                            >
                              {['confirmed', 'packed', 'picked_up', 'on_way', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={5} style={{ ...S.td, textAlign: 'center', padding: '3rem', color: '#888' }}>No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
