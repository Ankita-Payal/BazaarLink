// src/components/SellerOrders.jsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow, format } from 'date-fns';
import toast from 'react-hot-toast';

const SellerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  // Fetch orders for this seller
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'bulkOrders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = [];

      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();

        if (!Array.isArray(docData.orders)) return;

        const matchingOrders = docData.orders
          .map((order, idx) => ({
            ...order,
            parentId: docSnap.id,
            orderIndex: idx,
            createdAt: order.createdAt || new Date().toISOString(),
          }))
          .filter((order) => order.sellerId === currentUser.uid);

        allOrders.push(...matchingOrders);
      });

      // Sort orders by status priority and then by date
      const sortedOrders = allOrders.sort((a, b) => {
        const statusOrder = { Pending: 1, Accepted: 2, Completed: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

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

    return () => unsubscribe();
  }, [currentUser]);

  // Accept order
  const acceptOrder = async (parentId, orderIndex) => {
    try {
      const docRef = doc(db, 'bulkOrders', parentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        toast.error('Order not found');
        return;
      }

      const data = docSnap.data();
      const ordersCopy = [...data.orders];

      const deadline = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now
      ordersCopy[orderIndex].status = 'Accepted';
      ordersCopy[orderIndex].deliveryDeadline = deadline;
      ordersCopy[orderIndex].acceptedAt = new Date().toISOString();

      await updateDoc(docRef, { orders: ordersCopy });
      toast.success('Order accepted successfully!');
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  // Mark order as completed
  const completeOrder = async (parentId, orderIndex) => {
    try {
      const docRef = doc(db, 'bulkOrders', parentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        toast.error('Order not found');
        return;
      }

      const data = docSnap.data();
      const ordersCopy = [...data.orders];
      ordersCopy[orderIndex].status = 'Completed';
      ordersCopy[orderIndex].completedAt = new Date().toISOString();

      await updateDoc(docRef, { orders: ordersCopy });
      toast.success('Order marked as completed!');
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };

  // Auto-complete orders
  const checkForCompletion = async () => {
    const now = new Date();
    const q = query(collection(db, 'bulkOrders'));
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      let updated = false;

      const ordersCopy = data.orders.map((order) => {
        if (
          order.status === 'Accepted' &&
          order.deliveryDeadline &&
          new Date(order.deliveryDeadline.seconds * 1000) <= now
        ) {
          updated = true;
          return { ...order, status: 'Completed', completedAt: new Date().toISOString() };
        }
        return order;
      });

      if (updated) {
        await updateDoc(doc(db, 'bulkOrders', docSnap.id), {
          orders: ordersCopy,
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkForCompletion, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === filter.toLowerCase());
  };

  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Seller Orders</h1>
          <p className="text-gray-500">Manage and track all your incoming orders</p>
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

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 text-sm">
              {filter === 'all' 
                ? "You haven't received any orders yet" 
                : `No ${filter} orders at the moment`}
            </p>
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
                    <span className="text-xs text-gray-500">Price</span>
                    <span className="text-lg font-bold text-gray-900">₹{order.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Quantity</span>
                    <span className="text-sm font-medium text-gray-700">{order.quantity || 1} units</span>
                  </div>

                  {order.status === 'Accepted' && order.deliveryDeadline && (
                    <div className="bg-blue-50 rounded-lg p-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-blue-600">Delivery deadline</span>
                        <span className="text-xs font-medium text-blue-700">
                          {formatDistanceToNow(new Date(order.deliveryDeadline.seconds * 1000), { addSuffix: true })}
                        </span>
                      </div>
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
                </div>

                {/* Action Buttons */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => acceptOrder(order.parentId, order.orderIndex)}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 text-sm"
                    >
                      Accept Order ✓
                    </button>
                  )}
                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => completeOrder(order.parentId, order.orderIndex)}
                      className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 text-sm"
                    >
                      Mark as Completed ✓
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <div className="text-center text-xs text-green-600 font-medium">
                      ✓ Order Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;