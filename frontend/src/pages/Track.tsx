import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';
import * as socketService from '../services/socket';
import type { OrderResponse } from '../types/api';

interface RiderLocation {
  lat: number;
  lng: number;
  speed?: number;
  timestamp: string;
}

const STATUS_STAGES = [
  { key: 'pending',    label: 'Order Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed',     icon: '✅' },
  { key: 'packed',    label: 'Packed',        icon: '📦' },
  { key: 'picked_up', label: 'Picked Up',     icon: '🚗' },
  { key: 'on_way',    label: 'On the Way',    icon: '🚚' },
  { key: 'delivered', label: 'Delivered',      icon: '🎉' },
];

const STATUS_COLORS: Record<string, string> = {
  pending:         '#f59e0b',
  payment_pending: '#f59e0b',
  confirmed:       '#3b82f6',
  packed:          '#8b5cf6',
  picked_up:       '#06b6d4',
  on_way:          '#10b981',
  delivered:       '#059669',
  cancelled:       '#ef4444',
};

export default function Track() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/'); return; }

    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        setIsLoading(true);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
        socketService.connectSocket();
        socketService.joinOrderRoom(orderId);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
    return () => { if (orderId) socketService.leaveOrderRoom(orderId); };
  }, [isLoggedIn, orderId, navigate]);

  useEffect(() => {
    if (!orderId) return;
    const unsub = socketService.onOrderStatusUpdate((data) => {
      setOrder((prev) => (prev ? { ...prev, status: data.status as OrderResponse['status'] } : null));
    });
    return () => { if (unsub) unsub(); };
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    const unsub = socketService.onRiderLocationUpdate((data) => setRiderLocation(data.location));
    return () => { if (unsub) unsub(); };
  }, [orderId]);

  useEffect(() => {
    if (!order?.estimated_delivery_time) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(order.estimated_delivery_time!).getTime() - Date.now());
      setTimeRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [order?.estimated_delivery_time]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #0d9e6e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#555', fontFamily: "'Inter', sans-serif" }}>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
        <div style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
          <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Order not found</p>
          <button onClick={() => navigate('/')} style={{ background: '#0d9e6e', color: '#fff', border: 'none', borderRadius: 10, padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
            ← Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STAGES.findIndex((s) => s.key === order.status);
  const statusColor = STATUS_COLORS[order.status] || '#888';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111', textDecoration: 'none', letterSpacing: -1 }}>Quick<span style={{ color: '#0d9e6e' }}>Mart</span></a>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#555', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>← Continue Shopping</button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: '1.5rem' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Status header card */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order #{order.order_number}</div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0.25rem 0 0', color: '#111' }}>
                  {STATUS_STAGES.find(s => s.key === order.status)?.icon || '📦'} {STATUS_STAGES.find(s => s.key === order.status)?.label || order.status}
                </h1>
              </div>
              <span style={{ padding: '0.4rem 1rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 800, color: '#fff', background: statusColor }}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>

            {/* ETA countdown */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div style={{ background: 'linear-gradient(135deg, #f0fdf9, #d1fae5)', border: '1.5px solid #a7f3d0', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, margin: '0 0 0.3rem' }}>Estimated delivery in</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: '#065f46', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {timeRemaining > 0 ? formatTime(timeRemaining) : '~10:00'}
                </p>
              </div>
            )}
          </div>

          {/* Status Stepper */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', margin: '0 0 1.25rem' }}>📍 Order Journey</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STATUS_STAGES.map((stage, index) => {
                const isCompleted = index < currentStatusIndex;
                const isCurrent  = index === currentStatusIndex;
                const isPending  = index > currentStatusIndex;
                return (
                  <div key={stage.key} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    {/* Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem',
                        background: isCompleted ? '#0d9e6e' : isCurrent ? '#fff' : '#f5f5f0',
                        border: isCurrent ? `3px solid #0d9e6e` : isCompleted ? '3px solid #0d9e6e' : '2px solid #e0e0e0',
                        boxShadow: isCurrent ? '0 0 0 4px rgba(13,158,110,0.15)' : undefined,
                        transition: 'all 0.3s',
                      }}>
                        {stage.icon}
                      </div>
                      {index < STATUS_STAGES.length - 1 && (
                        <div style={{ width: 2, flexGrow: 1, minHeight: 32, background: isCompleted ? '#0d9e6e' : '#e8e8e8', margin: '4px 0', transition: 'background 0.3s' }} />
                      )}
                    </div>
                    {/* Label */}
                    <div style={{ paddingTop: 8, paddingBottom: index < STATUS_STAGES.length - 1 ? 20 : 0 }}>
                      <p style={{ margin: 0, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#0d9e6e' : isPending ? '#bbb' : '#555', fontSize: '0.9rem' }}>
                        {stage.label}
                      </p>
                      {isCurrent && (
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#0d9e6e' }}>Currently happening...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rider section */}
          {order.status === 'on_way' && (
            <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', margin: '0 0 1rem' }}>🏍️ Your Rider</h2>
              <div style={{ background: 'linear-gradient(135deg, #f0fdf9, #d1fae5)', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '3rem' }}>🚴</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#065f46' }}>Rider on the way!</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#059669' }}>Rider details will appear once assigned</p>
                </div>
              </div>
              {riderLocation && (
                <div style={{ marginTop: '0.875rem', background: '#eff6ff', borderRadius: 10, padding: '0.75rem', border: '1px solid #bfdbfe' }}>
                  <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#1e40af' }}>📍 Live Location</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#3b82f6' }}>
                    {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
                    {riderLocation.speed ? ` · ${riderLocation.speed} km/h` : ''}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Order items */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', margin: '0 0 1rem' }}>📦 Items Ordered</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items?.map((item: any, index: number) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', borderRadius: 10, background: '#f9f9f7' }}>
                  <span style={{ fontSize: '0.88rem', color: '#333', fontWeight: 600 }}>
                    {item.product_name || item.name || `Item #${index + 1}`}
                    <span style={{ color: '#888', fontWeight: 400 }}> × {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111' }}>
                    ₹{((item.price_at_purchase || 0) * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid #e8e8e8' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#111', margin: '0 0 0.75rem' }}>📍 Delivery Address</h2>
            <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {typeof order.delivery_address === 'string'
                ? order.delivery_address
                : (order.delivery_address as any)?.street + ', ' + (order.delivery_address as any)?.city}
            </p>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div>
          <div style={{ background: 'linear-gradient(145deg, #0c1a12, #0d3d26)', borderRadius: 16, padding: '1.5rem', color: '#fff', position: 'sticky', top: 80 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
              💳 Bill Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Order ID</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{order._id?.slice(-8)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Status</span>
                <span style={{ fontWeight: 700, color: '#4ade80' }}>{order.status.replace(/_/g, ' ')}</span>
              </div>
              {order.payment_method && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Payment</span>
                  <span style={{ textTransform: 'capitalize' }}>{order.payment_method}</span>
                </div>
              )}
              {order.delivery_fee !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Delivery</span>
                  <span>{order.delivery_fee === 0 ? <span style={{ color: '#4ade80' }}>FREE</span> : `₹${order.delivery_fee}`}</span>
                </div>
              )}
              {order.platform_fee !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Platform fee</span>
                  <span>₹{order.platform_fee}</span>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <span>Total</span>
              <span>₹{order.total_amount?.toFixed(0) || '0'}</span>
            </div>
            <button
              onClick={() => navigate('/')}
              style={{ width: '100%', background: '#fff', color: '#0d3d26', border: 'none', borderRadius: 10, padding: '0.875rem', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', transition: 'opacity 0.2s' }}
            >
              🛒 Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
