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
  items: any[];
}

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>(
    'profile'
  );
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Fetch addresses
  useEffect(() => {
    if (activeTab === 'addresses') {
      const fetchAddresses = async () => {
        try {
          const data = await userService.getSavedAddresses();
          setAddresses(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Failed to fetch addresses:', error);
        }
      };

      fetchAddresses();
    }
  }, [activeTab]);

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const response = await orderService.getUserOrders(1, 10);
          setOrders(response.data || []);
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      await authService.updateProfile(profileForm);
      addToast({
        type: 'success',
        message: 'Profile updated successfully',
      });
      setEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast({
        type: 'error',
        message: 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      addToast({
        type: 'success',
        message: 'Logged out successfully',
      });
      navigate('/');
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to logout',
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await userService.deleteAddress(id);
      setAddresses(addresses.filter((a) => a._id !== id));
      addToast({
        type: 'success',
        message: 'Address deleted',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to delete address',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  👤
                </div>
                <p className="font-bold text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-violet-100 text-violet-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'addresses'
                      ? 'bg-violet-100 text-violet-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📍 Addresses
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-violet-100 text-violet-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 Orders
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition mt-6"
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isLoading}
                        className="bg-violet-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-violet-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingProfile(false)}
                        className="bg-gray-300 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold text-gray-900">{user?.phone || 'Not set'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingProfile(true)}
                      className="bg-violet-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-violet-700"
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>

                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className="border border-gray-300 rounded-lg p-4 flex justify-between items-start"
                      >
                        <div>
                          <p className="font-bold text-gray-900">{addr.label}</p>
                          <p className="text-gray-700">
                            {addr.street}, {addr.city} {addr.pincode}
                          </p>
                          {addr.is_default && (
                            <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No saved addresses</p>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-violet-600 border-t-white rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-300 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                        onClick={() => navigate(`/track/${order._id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">
                              Order #{order.order_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-violet-600">
                              ₹{order.total_amount?.toFixed(2) || '0.00'}
                            </p>
                            <span
                              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No orders yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
