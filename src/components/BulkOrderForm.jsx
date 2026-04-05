// src/components/BulkOrderForm.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const BulkOrderForm = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([{ item: '', quantity: '', price: '' }]);
  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][field] = value;
    setOrders(updatedOrders);
  };

  const handleAddOrder = () => {
    setOrders([...orders, { item: '', quantity: '', price: '' }]);
  };

  const handleRemoveOrder = (index) => {
    if (orders.length === 1) {
      toast.error('At least one item is required');
      return;
    }
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser || role !== 'vendor') {
      toast.error('Only vendors can place bulk orders. Please login as vendor.');
      navigate('/login');
      return;
    }

    // Validate orders
    const isValid = orders.every(order => order.item.trim() && order.quantity && order.quantity > 0);
    if (!isValid) {
      toast.error('Please fill all item names and quantities');
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    setLoading(true);

    try {
      const ordersWithTimestamp = orders.map(order => ({
        ...order,
        quantity: Number(order.quantity),
        price: order.price ? Number(order.price) : 0,
        status: 'Pending',
        createdAt: Timestamp.now(),
      }));

      await addDoc(collection(db, 'bulkOrders'), {
        vendorId: currentUser.uid,
        vendorEmail: currentUser.email,
        vendorName: currentUser.displayName || currentUser.email,
        orders: ordersWithTimestamp,
        deliveryAddress,
        specialInstructions: specialInstructions.trim() || '',
        createdAt: Timestamp.now(),
        totalItems: orders.length,
        totalQuantity: orders.reduce((sum, order) => sum + Number(order.quantity), 0),
      });

      toast.success('Order placed successfully!');
      setOrders([{ item: '', quantity: '', price: '' }]);
      setDeliveryAddress('');
      setSpecialInstructions('');
      
      // Redirect to my orders after 2 seconds
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return orders.reduce((sum, order) => {
      const price = order.price ? Number(order.price) : 0;
      const quantity = order.quantity ? Number(order.quantity) : 0;
      return sum + (price * quantity);
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return orders.reduce((sum, order) => sum + (Number(order.quantity) || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">📦 Bulk Order Form</h1>
          <p className="text-gray-500">Place bulk orders from multiple sellers at once</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          
          {/* Orders Section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
              <span className="text-sm text-gray-500">{orders.length} item(s)</span>
            </div>
            
            <div className="space-y-3">
              {orders.map((order, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-xl relative group">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Rice, Flour, Oil"
                      value={order.item}
                      onChange={(e) => handleOrderChange(index, 'item', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      required
                    />
                  </div>
                  
                  <div className="w-full sm:w-28">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={order.quantity}
                      onChange={(e) => handleOrderChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="w-full sm:w-32">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={order.price}
                      onChange={(e) => handleOrderChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveOrder(index)}
                    className="absolute -top-2 -right-2 sm:relative sm:top-auto sm:right-auto mt-4 sm:mt-6 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition flex items-center justify-center shadow-md"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddOrder}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-lg">+</span> Add Another Item
            </button>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-gradient-to-r from-orange-50 to-rose-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-semibold text-gray-900">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-semibold text-gray-900">{calculateTotalQuantity()} units</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-orange-200">
                <span className="text-gray-900 font-bold">Estimated Total:</span>
                <span className="text-xl font-bold text-orange-600">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Delivery Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Enter complete delivery address with pincode"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                placeholder="Any specific requirements or instructions for the seller"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Placing Order...
                </span>
              ) : (
                'Place Bulk Order →'
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              By placing this order, you agree to our terms and conditions
            </p>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">ℹ️</span>
            <div>
              <p className="text-sm font-medium text-blue-800">How it works</p>
              <p className="text-xs text-blue-600 mt-1">
                Your order will be sent to nearby sellers. They'll review and accept your request.
                You can track the status of your order in the "My Orders" section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;