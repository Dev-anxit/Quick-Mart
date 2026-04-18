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
  { key: 'pending', label: 'Order Placed', icon: '📝' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'packed', label: 'Packed', icon: '📦' },
  { key: 'picked_up', label: 'Picked Up', icon: '🚗' },
  { key: 'on_way', label: 'On the Way', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
];

export default function Track() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // State
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Initialize
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        setIsLoading(true);
        const data = await orderService.getOrderById(orderId);
        setOrder(data);

        // Join Socket.io room
        socketService.connectSocket();
        socketService.joinOrderRoom(orderId);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();

    // Cleanup
    return () => {
      if (orderId) {
        socketService.leaveOrderRoom(orderId);
      }
    };
  }, [isLoggedIn, orderId, navigate]);

  // Listen for status updates
  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = socketService.onOrderStatusUpdate((data) => {
      console.log('Order status updated:', data);
      setOrder((prev) => (prev ? { ...prev, status: data.status } : null));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId]);

  // Listen for rider location updates
  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = socketService.onRiderLocationUpdate((data) => {
      setRiderLocation(data.location);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [orderId]);

  // Timer for remaining time
  useEffect(() => {
    if (!order?.estimated_delivery_time) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        new Date(order.estimated_delivery_time).getTime() - new Date().getTime()
      );
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.estimated_delivery_time]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STAGES.findIndex((s) => s.key === order.status);

  // Format time remaining
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 font-syne mb-2">
          Order #{order.order_number}
        </h1>
        <p className="text-gray-600 mb-8">
          {new Date(order.created_at).toLocaleDateString()}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Stepper */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-gray-900 mb-6 text-lg">Order Status</h2>

              {/* Time Remaining */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-sm text-blue-700 mb-1">Estimated delivery in</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatTime(timeRemaining)}
                  </p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-4">
                {STATUS_STAGES.map((stage, index) => (
                  <div key={stage.key} className="flex gap-4">
                    {/* Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition ${
                          index <= currentStatusIndex
                            ? 'bg-violet-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {stage.icon}
                      </div>

                      {/* Connector Line */}
                      {index < STATUS_STAGES.length - 1 && (
                        <div
                          className={`w-1 h-12 my-1 transition ${
                            index < currentStatusIndex ? 'bg-violet-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div
                      className={`flex-1 py-2 ${
                        index === currentStatusIndex
                          ? 'font-bold text-violet-600'
                          : 'text-gray-600'
                      }`}
                    >
                      <p>{stage.label}</p>
                      {index === currentStatusIndex && (
                        <p className="text-sm text-violet-500 mt-1">
                          Currently happening...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rider Information */}
            {order.status === 'on_way' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="font-bold text-gray-900 mb-4 text-lg">🚚 Your Rider</h2>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Coming Soon</p>
                    <p className="text-sm text-gray-600">Rider details will appear here</p>
                  </div>
                  <div className="text-3xl">🏍️</div>
                </div>

                {/* Location Map Placeholder */}
                {riderLocation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900">Rider Location</p>
                    <p className="text-xs text-blue-600 mt-2">
                      Lat: {riderLocation.lat.toFixed(4)}, Lng:{' '}
                      {riderLocation.lng.toFixed(4)}
                    </p>
                    {riderLocation.speed && (
                      <p className="text-xs text-blue-600">Speed: {riderLocation.speed} km/h</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Order Details */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">📦 Items</h2>

              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                {order.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.product_name || item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{(item.price_at_purchase * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                {order.discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee:</span>
                  <span>₹{order.delivery_fee?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee:</span>
                  <span>₹{order.platform_fee?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between font-bold text-lg text-violet-600 pt-2 border-t border-gray-200 mt-2">
                  <span>Total:</span>
                  <span>₹{order.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-lg">📍 Delivery Address</h2>

              <p className="text-gray-700">
                {typeof order.delivery_address === 'string'
                  ? order.delivery_address
                  : order.delivery_address?.street +
                    ', ' +
                    order.delivery_address?.city}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-lg p-6 text-white sticky top-8">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-violet-500">
                <div className="flex justify-between text-sm">
                  <span>Order ID:</span>
                  <span className="font-mono text-xs">{order._id?.slice(-8)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="font-semibold">{order.status}</span>
                </div>

                {order.payment_method && (
                  <div className="flex justify-between text-sm">
                    <span>Payment:</span>
                    <span className="font-semibold">{order.payment_method}</span>
                  </div>
                )}
              </div>

              <div className="text-xl font-bold mb-6 text-center">
                ₹{order.total_amount?.toFixed(2) || '0.00'}
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full bg- white text-violet-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
