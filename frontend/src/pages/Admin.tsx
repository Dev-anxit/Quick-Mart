import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>(
    'analytics'
  );
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check admin access
  useEffect(() => {
    // For demo purposes, check if user is available
    // In production, this would check against ADMIN_USER_UID from backend
    if (!user) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      // Would call GET /api/admin/dashboard
      addToast({
        type: 'info',
        message: 'Analytics loaded',
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      // Would call GET /api/admin/products
      addToast({
        type: 'info',
        message: 'Products loaded',
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // Would call GET /api/admin/orders
      addToast({
        type: 'info',
        message: 'Orders loaded',
      });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 font-syne mb-2">
          📊 Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage products, orders, and view analytics</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📈 Analytics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'products'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-violet-600 text-violet-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🛒 Orders
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Metric Cards */}
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-violet-600 mt-2">₹12,450</p>
              <p className="text-xs text-green-600 mt-2">+12% from yesterday</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">247</p>
              <p className="text-xs text-gray-600 mt-2">This month</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-green-600 mt-2">24</p>
              <p className="text-xs text-gray-600 mt-2">In stock</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-3xl font-bold text-red-600 mt-2">3</p>
              <p className="text-xs text-red-600 mt-2">Action needed</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
              <button className="bg-violet-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-violet-700">
                ➕ Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-bold">Product</th>
                    <th className="px-4 py-3 text-left font-bold">Category</th>
                    <th className="px-4 py-3 text-left font-bold">Price</th>
                    <th className="px-4 py-3 text-left font-bold">Stock</th>
                    <th className="px-4 py-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">₹{product.price}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3 space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 font-semibold">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-semibold">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                        No products found. Click "Add Product" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Management</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-bold">Order ID</th>
                    <th className="px-4 py-3 text-left font-bold">Customer</th>
                    <th className="px-4 py-3 text-left font-bold">Total</th>
                    <th className="px-4 py-3 text-left font-bold">Status</th>
                    <th className="px-4 py-3 text-left font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">#{order.order_number}</td>
                        <td className="px-4 py-3">{order.customer_name}</td>
                        <td className="px-4 py-3">₹{order.total_amount}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            defaultValue={order.status}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option>pending</option>
                            <option>confirmed</option>
                            <option>packed</option>
                            <option>picked_up</option>
                            <option>on_way</option>
                            <option>delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-600">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
