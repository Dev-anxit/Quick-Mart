import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';

interface OrderItem {
  id: string;
  product: { name: string; image_urls: string[] };
  quantity: number;
  price: number;
}

interface OrderDetails {
  id: string;
  order_number: string;
  total_amount: number;
  delivery_fee: number;
  status: string;
  delivery_address: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

const statusSteps = [
  { key: 'confirmed',  label: 'Order Confirmed',    icon: '✅', desc: 'We received your order' },
  { key: 'packed',     label: 'Packed',              icon: '📦', desc: 'Items are being packed' },
  { key: 'picked_up',  label: 'Picked Up',           icon: '🛵', desc: 'Rider picked up your order' },
  { key: 'on_way',     label: 'On the Way',          icon: '🚀', desc: 'Your order is heading to you' },
  { key: 'delivered',  label: 'Delivered',           icon: '🎉', desc: 'Enjoy your order!' },
];

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(10 * 60); // 10 minutes in seconds

  useEffect(() => {
    if (!isLoggedIn) { navigate('/'); return; }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!orderId) return;
    orderService.getOrderById(orderId)
      .then(data => setOrder(data))
      .catch(() => {
        // If we can't load the order (e.g. dev mode), show success UI anyway
        setOrder(null);
      })
      .finally(() => setIsLoading(false));
  }, [orderId]);

  // Delivery countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentStatusIdx = order
    ? statusSteps.findIndex(s => s.key === order.status)
    : 0;
  const activeStep = currentStatusIdx === -1 ? 0 : currentStatusIdx;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf9 0%, #f5f5f0 100%)', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <a href="/" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111', textDecoration: 'none', letterSpacing: -1 }}>
          Quick<span style={{ color: '#0d9e6e' }}>Mart</span>
        </a>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#0d9e6e', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 700 }}>
          ← Continue Shopping
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Success Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1a12 0%, #0d3d26 100%)',
          borderRadius: 20,
          padding: '2.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '8rem', opacity: 0.07, transform: 'rotate(15deg)' }}>🎉</div>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem', animation: 'bounceIn 0.6s ease' }}>🎉</div>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.5rem', letterSpacing: -0.5 }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 1.25rem', fontSize: '0.95rem' }}>
            {order ? `Order #${order.order_number}` : 'Your order is being processed'}
          </p>
          {/* Countdown */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.12)', borderRadius: 50, padding: '0.625rem 1.25rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
            <div>
              <div style={{ color: '#4ade80', fontWeight: 900, fontSize: '1.3rem', letterSpacing: 2 }}>{formatCountdown(countdown)}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 600 }}>ESTIMATED DELIVERY</div>
            </div>
          </div>
        </div>

        {/* Status Tracker */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8', marginBottom: '1.25rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', margin: '0 0 1.5rem' }}>📍 Order Status</h2>
          <div style={{ position: 'relative' }}>
            {statusSteps.map((step, idx) => {
              const isDone = idx <= activeStep;
              const isActive = idx === activeStep;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: idx < statusSteps.length - 1 ? '1rem' : 0 }}>
                  {/* Icon + line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: isDone ? (isActive ? '#0d9e6e' : '#d1fae5') : '#f3f4f6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem',
                      border: isActive ? '2px solid #0d9e6e' : isDone ? '2px solid #86efac' : '2px solid #e5e7eb',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive ? '0 0 0 4px rgba(13,158,110,0.15)' : 'none',
                    }}>
                      {step.icon}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div style={{ width: 2, height: 28, background: isDone ? '#86efac' : '#e5e7eb', marginTop: 4 }} />
                    )}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontWeight: isActive ? 800 : 600, color: isDone ? '#111' : '#aaa', fontSize: '0.9rem' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: isDone ? '#6b7280' : '#ccc', marginTop: 2 }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        {order && !isLoading && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8', marginBottom: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', margin: '0 0 1rem' }}>📦 Order Summary</h2>
            {order.items?.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f0f0f0' }}>
                {item.product?.image_urls?.[0] && (
                  <img src={item.product.image_urls[0]} alt={item.product.name} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#111', fontSize: '0.88rem' }}>{item.product?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#888' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 800, color: '#111' }}>₹{(item.price * item.quantity).toFixed(0)}</div>
              </div>
            ))}
            {/* Totals */}
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#555', marginBottom: '0.4rem' }}>
                <span>Delivery Fee</span><span>₹{order.delivery_fee === 0 ? 'FREE' : order.delivery_fee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.05rem', color: '#111', marginTop: '0.5rem' }}>
                <span>Total Paid</span><span>₹{order.total_amount?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {order?.delivery_address && (
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #e8e8e8', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ fontSize: '1.5rem' }}>📍</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>Delivering To</div>
              <div style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{order.delivery_address}</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.875rem' }}>
          {orderId && (
            <button
              onClick={() => navigate(`/track/${orderId}`)}
              style={{ flex: 1, background: '#0d9e6e', color: '#fff', border: 'none', borderRadius: 12, padding: '1rem', fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}
            >
              🗺️ Track Order Live
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            style={{ flex: 1, background: '#f0f0f0', color: '#333', border: 'none', borderRadius: 12, padding: '1rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🛒 Continue Shopping
          </button>
        </div>

        {/* Tip */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#aaa' }}>
          💬 Questions? Contact us at <strong>support@quickmart.in</strong>
        </div>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
