import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VendorDashboard = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalItems: 0,
    pendingItems: 0,
    acceptedItems: 0,
    completedItems: 0,
    revenue: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to safely parse date
  const parseDate = (dateValue) => {
    if (!dateValue) return new Date();
    
    // If it's a Firestore Timestamp with toDate method
    if (typeof dateValue?.toDate === 'function') {
      return dateValue.toDate();
    }
    
    // If it's a string or already a Date object
    return new Date(dateValue);
  };

  useEffect(() => {
    if (!userData?.uid) return;

    setLoading(true);
    setError(null);

    const q = query(collection(db, "bulkOrders"), where("vendorId", "==", userData.uid));
    
    // Real-time listener for orders
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        let totalOrdersCount = 0;
        let totalItemsCount = 0;
        let pendingItemsCount = 0;
        let acceptedItemsCount = 0;
        let completedItemsCount = 0;
        let totalRevenueValue = 0;
        let monthlyRevenueValue = 0;
        const recentOrdersList = [];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const ordersArray = data.orders || [];
          
          // FIXED: Safely parse the createdAt date
          let orderDate;
          try {
            orderDate = parseDate(data.createdAt);
          } catch (e) {
            orderDate = new Date();
          }
          
          // Count documents as orders
          totalOrdersCount++;
          
          // Process each item in the order
          ordersArray.forEach((order) => {
            totalItemsCount++;
            
            // Count by status
            if (!order.status || order.status === "Pending") {
              pendingItemsCount++;
            } else if (order.status === "Accepted") {
              acceptedItemsCount++;
            } else if (order.status === "Completed") {
              completedItemsCount++;
            }
            
            // Calculate revenue
            const price = order.price || order.discountedPrice || 0;
            const quantity = order.quantity || 1;
            const itemRevenue = price * quantity;
            totalRevenueValue += itemRevenue;
            
            // Calculate monthly revenue using the order's date
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
              monthlyRevenueValue += itemRevenue;
            }
            
            // Add to recent orders (collect all first)
            recentOrdersList.push({
              id: doc.id,
              item: order.item,
              quantity: quantity,
              status: order.status || "Pending",
              price: price,
              date: orderDate,
            });
          });
        });

        // Sort recent orders by date (newest first) and take top 5
        const sortedRecentOrders = recentOrdersList.sort((a, b) => b.date - a.date).slice(0, 5);
        
        setStats({
          totalOrders: totalOrdersCount,
          totalItems: totalItemsCount,
          pendingItems: pendingItemsCount,
          acceptedItems: acceptedItemsCount,
          completedItems: completedItemsCount,
          revenue: totalRevenueValue,
          monthlyRevenue: monthlyRevenueValue,
        });
        setRecentOrders(sortedRecentOrders);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch orders: ", err);
        setError("Failed to load order data");
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userData]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">⏳ Pending</span>;
      case 'Accepted':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">✓ Accepted</span>;
      case 'Completed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">✅ Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {userData?.displayName || userData?.email?.split('@')[0] || 'Vendor'}! 👋
          </h1>
          <p className="text-orange-100">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📋</span>
              </div>
              <span className="text-xs text-gray-400">All time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500 mt-1">Total Orders</p>
            <p className="text-xs text-gray-400 mt-2">{stats.totalItems} items ordered</p>
          </div>

          {/* Pending Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
              <span className="text-xs text-gray-400">Needs attention</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingItems}</p>
            <p className="text-sm text-gray-500 mt-1">Pending Items</p>
            {stats.acceptedItems > 0 && (
              <p className="text-xs text-gray-400 mt-2">{stats.acceptedItems} accepted</p>
            )}
          </div>

          {/* Completed Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <span className="text-xs text-gray-400">Delivered</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.completedItems}</p>
            <p className="text-sm text-gray-500 mt-1">Completed Items</p>
            <p className="text-xs text-gray-400 mt-2">
              {((stats.completedItems / (stats.totalItems || 1)) * 100).toFixed(0)}% completion rate
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <span className="text-xs text-gray-400">Total value</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">₹{stats.revenue.toLocaleString('en-IN')}</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
            <p className="text-xs text-green-600 mt-2">
              +₹{stats.monthlyRevenue.toLocaleString('en-IN')} this month
            </p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">📦 Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-1">Your latest 5 orders</p>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-500">No orders yet</p>
              <button
                onClick={() => navigate('/bulk-order')}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200"
              >
                Place Your First Order →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order, idx) => (
                <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{order.item}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span>📦 Qty: {order.quantity}</span>
                        <span>💰 ₹{order.price}</span>
                        <span>📅 {formatDate(order.date)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/my-orders')}
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium transition"
                    >
                      Track Order →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {recentOrders.length > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
              <button
                onClick={() => navigate('/my-orders')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition"
              >
                View All Orders →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🛒</span>
              <h3 className="font-bold text-gray-900">Place New Order</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Need to restock? Place a new bulk order now.</p>
            <button
              onClick={() => navigate('/bulk-order')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              Order Now →
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏪</span>
              <h3 className="font-bold text-gray-900">Find Nearby Sellers</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Discover local sellers for better prices and faster delivery.</p>
            <button
              onClick={() => navigate('/nearby')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Explore Sellers →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;