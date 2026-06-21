import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import apiClient from '../services/api';
import * as socketService from '../services/socket';

interface Order {
  id: string;
  _id: string;
  order_number: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  created_at: string;
  items: any[];
  user?: {
    name: string;
    phone: string;
  };
}

export default function DeliveryPartner() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [isActive, setIsActive] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simulation states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);
  const simIntervalRef = useRef<any>(null);

  // Map Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Connect to websocket when active delivery is on
  useEffect(() => {
    if (isLoggedIn) {
      socketService.connectSocket();
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    if (!isActive) return;
    setIsLoading(true);
    try {
      const res = await apiClient.get('/admin/orders?limit=100');
      const allOrders = res.data.orders || res.data.data || [];
      // Available orders are those which are confirmed, packed or picked_up
      setOrders(allOrders);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchOrders();
    const pollInterval = setInterval(fetchOrders, 10000);
    return () => clearInterval(pollInterval);
  }, [isLoggedIn, isActive]);

  // Clean simulation interval on unmount
  useEffect(() => {
    return () => {
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  // Accept Order
  const handleAcceptOrder = async (order: Order) => {
    const orderId = order._id || order.id;
    try {
      // 1. Assign rider and change status to confirmed/packed if pending, or set to picked_up
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: 'packed' });
      
      // Update local state
      const accepted = { ...order, status: 'packed' };
      setActiveOrder(accepted);
      
      // Join Room
      socketService.joinOrderRoom(orderId);
      
      // Broadcast Status via socket
      const socket = socketService.getSocket();
      socket?.emit('broadcast_order_status', { orderId, status: 'packed' });

      addToast({ type: 'success', message: 'Order accepted! Go pick it up at store.' });
    } catch {
      addToast({ type: 'error', message: 'Failed to accept order' });
    }
  };

  // Pick up Order (Mark as on the way)
  const handleStartDelivery = async () => {
    if (!activeOrder) return;
    const orderId = activeOrder._id || activeOrder.id;
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: 'on_way' });
      setActiveOrder(prev => (prev ? { ...prev, status: 'on_way' } : null));

      // Broadcast Status via socket
      const socket = socketService.getSocket();
      socket?.emit('broadcast_order_status', { orderId, status: 'on_way' });
      addToast({ type: 'success', message: 'Order picked up! Navigation started.' });

      // Start live coordinate simulation
      startRouteSimulation(orderId);
    } catch {
      addToast({ type: 'error', message: 'Failed to update order status' });
    }
  };

  // Delivery completed
  const handleCompleteDelivery = async () => {
    if (!activeOrder) return;
    const orderId = activeOrder._id || activeOrder.id;
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: 'delivered' });
      
      // Broadcast status
      const socket = socketService.getSocket();
      socket?.emit('broadcast_order_status', { orderId, status: 'delivered' });

      // Stop simulation
      stopSimulation();

      addToast({ type: 'success', message: '🎉 Order delivered successfully! Good job!' });
      
      // Leave room
      socketService.leaveOrderRoom(orderId);
      setActiveOrder(null);
      fetchOrders();
    } catch {
      addToast({ type: 'error', message: 'Failed to complete delivery' });
    }
  };

  // Stop Simulation helper
  const stopSimulation = () => {
    setIsSimulating(false);
    setSimProgress(0);
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  };

  // Coordinate route simulation
  const startRouteSimulation = (orderId: string) => {
    stopSimulation();
    setIsSimulating(true);
    
    // Store coordinates (Delhi center)
    const storeLat = 28.6139;
    const storeLng = 77.2090;
    
    // Customer coordinates (slight offset)
    const customerLat = storeLat + 0.0125;
    const customerLng = storeLng + 0.0150;

    let progress = 0;
    const totalSteps = 20;

    simIntervalRef.current = setInterval(() => {
      progress += 1;
      const ratio = progress / totalSteps;
      
      const currentLat = storeLat + (customerLat - storeLat) * ratio;
      const currentLng = storeLng + (customerLng - storeLng) * ratio;
      
      setSimProgress(ratio * 100);

      // Emit coordinate update over socket
      const socket = socketService.getSocket();
      socket?.emit('update_rider_location', {
        orderId,
        lat: currentLat,
        lng: currentLng,
        speed: 40 + Math.floor(Math.random() * 15)
      });

      if (progress >= totalSteps) {
        clearInterval(simIntervalRef.current!);
        simIntervalRef.current = null;
        addToast({ type: 'info', message: 'You have arrived at the customer location!' });
      }
    }, 2000);
  };

  // Draw Navigation Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dimensions
    const w = canvas.width;
    const h = canvas.height;

    // Node Coords
    const storeX = w * 0.15;
    const storeY = h * 0.75;
    
    const customerX = w * 0.85;
    const customerY = h * 0.25;

    // Draw route path line
    ctx.beginPath();
    ctx.moveTo(storeX, storeY);
    // Draw slight curving path
    ctx.bezierCurveTo(w * 0.4, h * 0.8, w * 0.6, h * 0.2, customerX, customerY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.setLineDash([8, 8]);
    ctx.stroke();

    // Draw traveled path highlight
    const progressRatio = simProgress / 100;
    ctx.beginPath();
    ctx.moveTo(storeX, storeY);
    // Calculate current rider pixel coordinate along path
    const riderX = storeX + (customerX - storeX) * progressRatio;
    const riderY = storeY + (customerY - storeY) * progressRatio;
    ctx.lineTo(riderX, riderY);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;
    ctx.setLineDash([0, 0]);
    ctx.stroke();

    // Draw Store pin
    ctx.beginPath();
    ctx.arc(storeX, storeY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏪', storeX, storeY);

    // Draw Customer Home pin
    ctx.beginPath();
    ctx.arc(customerX, customerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('🏠', customerX, customerY);

    // Draw Rider bike dot
    ctx.beginPath();
    ctx.arc(riderX, riderY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillText('🏍️', riderX, riderY);
  }, [simProgress]);

  // Filters unassigned / delivery orders
  const availableOrders = orders.filter(o => o.status === 'confirmed');

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 1.5rem', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🏍️</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>QuickMart <span style={{ color: '#10b981' }}>Partner</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Active status toggle */}
          <button 
            onClick={() => setIsActive(!isActive)}
            style={{
              background: isActive ? '#065f46' : '#991b1b',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
            {isActive ? 'GO OFFLINE' : 'GO ONLINE'}
          </button>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.78rem', cursor: 'pointer' }}>Exit Portal</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {activeOrder ? (
          /* Active Delivery Dashboard */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
            
            {/* Navigation & simulation details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#1e293b', borderRadius: 16, padding: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>🗺️ Delivery Route Map</h3>
                <div style={{ position: 'relative', width: '100%', height: '240px', background: '#0f172a', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
                  <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={240} 
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(30, 41, 59, 0.9)', padding: '0.4rem 0.8rem', borderRadius: 6, fontSize: '0.72rem', border: '1px solid #334155' }}>
                    🚩 Speed: {isSimulating ? `${38 + Math.floor(Math.random() * 8)} km/h` : '0 km/h'}
                  </div>
                </div>
              </div>

              {/* Status progression panel */}
              <div style={{ background: '#1e293b', borderRadius: 16, padding: '1.5rem', border: '1px solid #334155', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800, fontSize: '1.1rem' }}>📈 Order Status Progression</h3>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ opacity: activeOrder.status === 'packed' ? 1 : 0.4 }}>
                    <div style={{ fontSize: '2rem' }}>📦</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>Packed</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#475569', alignSelf: 'center' }}>➔</div>
                  <div style={{ opacity: activeOrder.status === 'on_way' ? 1 : 0.4 }}>
                    <div style={{ fontSize: '2rem' }}>🚚</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>On the Way</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#475569', alignSelf: 'center' }}>➔</div>
                  <div style={{ opacity: activeOrder.status === 'delivered' ? 1 : 0.4 }}>
                    <div style={{ fontSize: '2rem' }}>🎉</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.25rem' }}>Delivered</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  {activeOrder.status === 'packed' && (
                    <button 
                      onClick={handleStartDelivery}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', flex: 1 }}
                    >
                      Start Out for Delivery (On the Way)
                    </button>
                  )}
                  {activeOrder.status === 'on_way' && (
                    <button 
                      onClick={handleCompleteDelivery}
                      style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, padding: '0.85rem 1.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', flex: 1 }}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Details & Items Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#1e293b', borderRadius: 16, padding: '1.5rem', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>👤 Delivery Details</h3>
                  <span style={{ fontSize: '0.75rem', background: '#334155', padding: '0.25rem 0.5rem', borderRadius: 6, fontWeight: 700 }}>#{activeOrder.order_number}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Customer Name</label>
                    <span style={{ fontWeight: 700 }}>{activeOrder.user?.name || 'QuickMart Customer'}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Address</label>
                    <span style={{ fontWeight: 600, color: '#e2e8f0', lineHeight: 1.4, display: 'block' }}>{activeOrder.delivery_address}</span>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Phone</label>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>📞 +91 {activeOrder.user?.phone || '9876543210'}</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#1e293b', borderRadius: 16, padding: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>📦 Items to Deliver</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ color: '#94a3b8' }}><strong style={{ color: '#fff' }}>{item.quantity}x</strong> {item.product?.name || 'Product'}</span>
                      <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Available Deliveries Queue */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h2 style={{ margin: 0, fontWeight: 900, fontSize: '1.5rem' }}>📥 Available Deliveries</h2>
                <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Accept pending orders to begin the delivery journey.</p>
              </div>
              <button 
                onClick={fetchOrders}
                style={{
                  background: '#334155',
                  color: '#fff',
                  border: '1px solid #475569',
                  borderRadius: 10,
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Queue
              </button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" /></div>
            ) : availableOrders.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {availableOrders.map(order => (
                  <div key={order._id || order.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#10b981' }}>#{order.order_number}</span>
                      <span style={{ background: '#065f46', color: '#34d399', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 6 }}>READY</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      <div style={{ marginBottom: '0.4rem' }}>📍 <span style={{ color: '#fff', fontWeight: 600 }}>{order.delivery_address}</span></div>
                      <div>🛍️ Items: <strong style={{ color: '#fff' }}>{order.items?.length || 0} items</strong></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Payout</div>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff' }}>₹{order.total_amount}</span>
                      </div>
                      <button 
                        onClick={() => handleAcceptOrder(order)}
                        style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Accept Delivery
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#1e293b', borderRadius: 16, border: '1px solid #334155' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>No Deliveries Available</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>Check back later or toggle your online status to fetch new orders.</p>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Spinner Animation */}
      <style>{`
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #334155;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
