import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import authService from '../services/authService';
import userService from '../services/userService';
import orderService from '../services/orderService';

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  pincode: string;
  is_default: boolean;
}

interface Order {
  _id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: Record<string, unknown>[];
}

const S = {
  page: { minHeight: '100vh', background: '#f5f5f0', fontFamily: "'Inter', sans-serif" },
  header: { background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky' as const, top: 0, zIndex: 50 },
  logo: { fontSize: '1.4rem', fontWeight: 900, color: '#111', textDecoration: 'none', letterSpacing: -1 },
  body: { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' },
  card: { background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' },
  sidebar: { background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8', position: 'sticky' as const, top: 80, height: 'fit-content' },
  avatar: { width: 64, height: 64, background: 'linear-gradient(135deg, #0d9e6e, #065f46)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 0.75rem' },
  tabBtn: (active: boolean) => ({ width: '100%', textAlign: 'left' as const, padding: '0.625rem 0.875rem', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', background: active ? '#f0fdf9' : 'none', color: active ? '#0d9e6e' : '#555', transition: 'all 0.2s', marginBottom: 4 } as React.CSSProperties),
  input: { width: '100%', padding: '0.625rem 0.875rem', border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as const },
  btnPrimary: { background: '#0d9e6e', color: '#fff', border: 'none', borderRadius: 10, padding: '0.625rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  btnSecondary: { background: '#f0f0f0', color: '#555', border: 'none', borderRadius: 10, padding: '0.625rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
  btnDanger: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '0.625rem 1.25rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', width: '100%', marginTop: '1rem' },
};

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (activeTab === 'addresses') {
      userService.getSavedAddresses()
        .then(data => setAddresses(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      orderService.getUserOrders(1, 10)
        .then(r => setOrders(r.data || []))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await authService.updateProfile(profileForm);
      addToast({ type: 'success', message: 'Profile updated successfully' });
      setEditingProfile(false);
    } catch {
      addToast({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      addToast({ type: 'error', message: 'Failed to logout' });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await userService.deleteAddress(id);
      setAddresses(addresses.filter(a => a._id !== id));
      addToast({ type: 'success', message: 'Address deleted' });
    } catch {
      addToast({ type: 'error', message: 'Failed to delete address' });
    }
  };

  const statusColor = (s: string) => {
    if (s === 'delivered') return { bg: '#d1fae5', color: '#065f46' };
    if (s === 'cancelled') return { bg: '#fee2e2', color: '#991b1b' };
    return { bg: '#dbeafe', color: '#1d4ed8' };
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <a href="/" style={S.logo}>Quick<span style={{ color: '#0d9e6e' }}>Mart</span></a>
        <span style={{ fontSize: '0.85rem', color: '#888' }}>My Account</span>
      </div>

      <div style={S.body}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={S.avatar}>👤</div>
            <p style={{ fontWeight: 800, color: '#111', margin: '0 0 0.25rem' }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '0.78rem', color: '#888', margin: 0 }}>{user?.email}</p>
          </div>
          <div>
            {(['profile', 'addresses', 'orders'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={S.tabBtn(activeTab === tab)}>
                {tab === 'profile' ? '👤 Profile' : tab === 'addresses' ? '📍 Saved Addresses' : '📦 Order History'}
              </button>
            ))}
          </div>
          <button onClick={handleLogout} style={S.btnDanger}>🚪 Logout</button>
        </div>

        {/* Main */}
        <div>
          {/* Profile */}
          {activeTab === 'profile' && (
            <div style={S.card}>
              <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111', margin: '0 0 1.5rem' }}>Profile Information</h2>
              {editingProfile ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#555', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                      <input
                        type={f.type}
                        value={(profileForm as any)[f.key]}
                        onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        style={S.input}
                        onFocus={e => (e.target.style.borderColor = '#0d9e6e')}
                        onBlur={e => (e.target.style.borderColor = '#e0e0e0')}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={handleUpdateProfile} disabled={isLoading} style={S.btnPrimary}>
                      {isLoading ? 'Saving...' : '✓ Save Changes'}
                    </button>
                    <button onClick={() => setEditingProfile(false)} style={S.btnSecondary}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {[
                      { label: 'Full Name', value: user?.name || 'Not set' },
                      { label: 'Email', value: user?.email || 'Not set' },
                      { label: 'Phone', value: user?.phone || 'Not set' },
                    ].map(f => (
                      <div key={f.label} style={{ background: '#f9f9f7', borderRadius: 10, padding: '0.875rem' }}>
                        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</p>
                        <p style={{ fontWeight: 700, color: '#111', margin: 0, fontSize: '0.9rem' }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setEditingProfile(true)} style={S.btnPrimary}>✏️ Edit Profile</button>
                </div>
              )}
            </div>
          )}

          {/* Addresses */}
          {activeTab === 'addresses' && (
            <div style={S.card}>
              <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111', margin: '0 0 1.25rem' }}>📍 Saved Addresses</h2>
              {addresses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {addresses.map(addr => (
                    <div key={addr._id} style={{ border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                          <span style={{ fontWeight: 800, color: '#111', fontSize: '0.9rem', textTransform: 'capitalize' }}>{addr.label}</span>
                          {addr.is_default && <span style={{ background: '#f0fdf9', color: '#0d9e6e', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 20 }}>Default</span>}
                        </div>
                        <p style={{ color: '#555', margin: 0, fontSize: '0.85rem' }}>{addr.street}, {addr.city} — {addr.pincode}</p>
                      </div>
                      <button onClick={() => handleDeleteAddress(addr._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Delete</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📍</div>
                  <p style={{ fontWeight: 600 }}>No saved addresses yet</p>
                  <p style={{ fontSize: '0.85rem' }}>Addresses you save during checkout will appear here</p>
                </div>
              )}
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div style={S.card}>
              <h2 style={{ fontWeight: 900, fontSize: '1.2rem', color: '#111', margin: '0 0 1.25rem' }}>📦 Order History</h2>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ width: 36, height: 36, border: '3px solid #0d9e6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {orders.map(order => {
                    const sc = statusColor(order.status);
                    return (
                      <div key={order._id} onClick={() => navigate(`/track/${order._id}`)}
                        style={{ border: '1.5px solid #e0e0e0', borderRadius: 12, padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#0d9e6e'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(13,158,110,0.1)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#e0e0e0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                      >
                        <div>
                          <p style={{ fontWeight: 800, color: '#111', margin: '0 0 0.25rem', fontSize: '0.9rem' }}>Order #{order.order_number}</p>
                          <p style={{ color: '#888', margin: 0, fontSize: '0.8rem' }}>{new Date(order.created_at).toLocaleDateString()} · {order.items?.length || 0} items</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 900, color: '#111', margin: '0 0 0.375rem', fontSize: '1rem' }}>₹{order.total_amount?.toFixed(0)}</p>
                          <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: sc.bg, color: sc.color }}>{order.status.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#888' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📦</div>
                  <p style={{ fontWeight: 600 }}>No orders yet</p>
                  <p style={{ fontSize: '0.85rem' }}>Your order history will appear here after you place an order</p>
                  <button onClick={() => navigate('/')} style={{ ...S.btnPrimary, marginTop: '1rem' }}>Start Shopping →</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @media (max-width: 768px) { div[style*="gridTemplateColumns: 260px"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
