// src/components/MyOrders.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in user:", user.uid);
        try {
          // Use real-time listener for better UX
          const q = query(collection(db, "bulkOrders"), where("vendorId", "==", user.uid));
          const unsubscribeOrders = onSnapshot(q, (snapshot) => {
            const allOrders = [];
            
            snapshot.forEach((doc) => {
              const data = doc.data();
              console.log("Fetched Doc:", data);

              if (Array.isArray(data.orders)) {
                // Add parent document ID to each order for reference
                const ordersWithId = data.orders.map((order, idx) => ({
                  ...order,
                  parentId: doc.id,
                  orderIndex: idx,
                  createdAt: order.createdAt || new Date().toISOString(),
                }));
                allOrders.push(...ordersWithId);
              }
            });

            // Sort orders by date (newest first)
            const sortedOrders = allOrders.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

            console.log("Total orders for vendor:", sortedOrders);
            setOrders(sortedOrders);
            
            // Calculate stats
            const statsData = {
              total: sortedOrders.length,
              pending: sortedOrders.filter(o => o.status === 'Pending').length,
              accepted: sortedOrders.filter(o => o.status === 'Accepted').length,
              completed: sortedOrders.filter(o => o.status === 'Completed').length,
            };
            setStats(statsData);
            setLoading(false);
          });

          return () => unsubscribeOrders();
        } catch (error) {
          console.error("Error fetching orders:", error);
          toast.error("Failed to load orders");
          setLoading(false);
        }
      } else {
        console.log("No user logged in");
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">✓ Accepted</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status || 'Pending'}</span>;
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status?.toLowerCase() === filter.toLowerCase());
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📋 My Orders</h1>
          <p className="text-gray-500">Track and manage all your bulk orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-gray-500 font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-yellow-600 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-blue-600 font-medium">Accepted</p>
            <p className="text-2xl font-bold text-blue-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs text-green-600 font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'pending', 'accepted', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                filter === tab
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === tab ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab === 'pending' ? stats.pending : tab === 'accepted' ? stats.accepted : stats.completed}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm">
              {filter === 'all' 
                ? "You haven't placed any orders yet" 
                : `No ${filter} orders at the moment`}
            </p>
            <button 
              onClick={() => window.location.href = '/bulk-order'}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
            >
              Place Your First Order →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🛒</span>
                      <span className="text-sm font-semibold text-gray-900">{order.item}</span>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Quantity</span>
                    <span className="text-lg font-bold text-gray-900">{order.quantity || 1} units</span>
                  </div>
                  
                  {order.price && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Total Price</span>
                      <span className="text-lg font-bold text-orange-600">₹{order.price}</span>
                    </div>
                  )}

                  {order.deliveryDeadline && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-600">Delivery deadline</span>
                        <span className="text-xs font-medium text-blue-700">
                          {formatDistanceToNow(new Date(order.deliveryDeadline.seconds * 1000), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  )}

                  {order.createdAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Order placed</span>
                      <span className="text-xs text-gray-600">
                        {format(new Date(order.createdAt), 'dd MMM, hh:mm a')}
                      </span>
                    </div>
                  )}

                  {order.acceptedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Accepted at</span>
                      <span className="text-xs text-gray-600">
                        {format(new Date(order.acceptedAt), 'dd MMM, hh:mm a')}
                      </span>
                    </div>
                  )}

                  {order.completedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Completed at</span>
                      <span className="text-xs text-gray-600">
                        {format(new Date(order.completedAt), 'dd MMM, hh:mm a')}
                      </span>
                    </div>
                  )}

                  {/* Seller Info if available */}
                  {order.sellerName && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Seller</span>
                      <span className="text-xs font-medium text-gray-700">{order.sellerName}</span>
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className={`text-center ${order.status !== 'Pending' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="text-lg">📝</div>
                      <div>Ordered</div>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${order.status !== 'Pending' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`text-center ${order.status === 'Accepted' || order.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="text-lg">✓</div>
                      <div>Accepted</div>
                    </div>
                    <div className={`flex-1 h-0.5 mx-2 ${order.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`text-center ${order.status === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className="text-lg">✅</div>
                      <div>Delivered</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;