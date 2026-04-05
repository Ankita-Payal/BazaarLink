// src/components/NearbyStores.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const PEXELS_API_KEY = '4zku6FCJ44pQzFwLc5oJ3xrsyGnGUISuesAyM99dhYfTXQigACES1NSF';

const NearbyStores = () => {
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState({});
  const [quantities, setQuantities] = useState({});
  const [ordering, setOrdering] = useState(null);
  const { userData } = useAuth();

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setError('');
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('❌ Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  // Fetch stores and calculate distances
  useEffect(() => {
    const fetchStores = async () => {
      if (!location) return;
      
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'stores'));
        const storeList = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const distance = location ? haversine(location, data.location) : null;
          storeList.push({ 
            id: doc.id,
            ...data, 
            distance 
          });
        });

        // Filter stores with valid distance and sort
        const validStores = storeList.filter(store => store.distance !== null);
        validStores.sort((a, b) => a.distance - b.distance);
        setStores(validStores);
        
        // Fetch images for unique materials
        const uniqueMaterials = [...new Set(validStores.flatMap(store => 
          store.materials?.map(mat => mat.item) || []
        ))];
        
        for (const material of uniqueMaterials) {
          if (!images[material]) {
            const img = await fetchImage(material);
            setImages(prev => ({ ...prev, [material]: img }));
          }
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Failed to load stores');
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [location]);

  const haversine = (loc1, loc2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const dLon = ((loc2.lng - loc1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchImage = async (query) => {
    try {
      const res = await axios.get('https://api.pexels.com/v1/search', {
        headers: { Authorization: PEXELS_API_KEY },
        params: { query, per_page: 1 },
      });
      return res.data.photos?.[0]?.src.medium || '';
    } catch (error) {
      console.error('Image fetch error:', error);
      return '';
    }
  };

  const handleQuantityChange = (key, value) => {
    setQuantities(prev => ({
      ...prev,
      [key]: parseInt(value) || 1,
    }));
  };

  const handleOrder = async (material, store) => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    if (userData?.role === 'seller') {
      toast.error('Sellers cannot place orders. Please login as vendor.');
      return;
    }

    const key = `${store.id}-${material.item}`;
    const quantity = quantities[key] || 1;

    setOrdering(key);
    try {
      // FIXED: Create order object without serverTimestamp inside array
      const orderItem = {
        item: material.item,
        quantity: quantity,
        price: material.price,
        discountedPrice: material.discount ? material.price * (1 - material.discount / 100) : material.price,
        discount: material.discount || 0,
        storeName: store.name,
        storeId: store.id,
        sellerId: store.sellerId,
        status: 'Pending',
        createdAt: new Date().toISOString(), // Use ISO string instead of serverTimestamp
      };

      await addDoc(collection(db, 'bulkOrders'), {
        vendorId: user.uid,
        vendorEmail: user.email,
        vendorName: user.displayName || user.email,
        orders: [orderItem],
        createdAt: new Date().toISOString(), // Use ISO string for the document too
        updatedAt: new Date().toISOString(),
      });

      toast.success(`✅ Order placed for ${material.item} (Qty: ${quantity})`);
      setQuantities(prev => ({ ...prev, [key]: 1 }));
    } catch (err) {
      console.error('Order failed:', err);
      toast.error('❌ Failed to place order. Please try again.');
    } finally {
      setOrdering(null);
    }
  };

  const getDiscountPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Finding nearby stores...</p>
          <p className="text-xs text-gray-400 mt-2">Please wait while we locate you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Location Required</h2>
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

  if (stores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Stores Found</h2>
          <p className="text-gray-500 text-sm">
            No stores available in your area at the moment. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            🏪 Nearby Stores
          </h1>
          <p className="text-gray-500">
            {stores.length} stores found within your area
          </p>
          {location && (
            <p className="text-xs text-gray-400 mt-2">
              📍 Based on your current location
            </p>
          )}
        </div>

        {/* Stores Grid */}
        <div className="space-y-6">
          {stores.map((store, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
              
              {/* Store Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{store.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{store.address || 'Address not available'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">📍</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {store.distance?.toFixed(1)} km away
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {store.materials?.map((mat, i) => {
                    const key = `${store.id}-${mat.item}`;
                    const finalPrice = getDiscountPrice(mat.price, mat.discount);
                    const hasDiscount = mat.discount && mat.discount > 0;
                    
                    return (
                      <div key={i} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                        {/* Product Image */}
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-white mb-3">
                          <img
                            src={images[mat.item] || 'https://via.placeholder.com/150x150?text=No+Image'}
                            alt={mat.item}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150x150?text=Product';
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{mat.item}</h3>
                          
                          <div className="mb-2">
                            {hasDiscount ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-orange-600">
                                  ₹{finalPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                  ₹{mat.price}
                                </span>
                                <span className="text-xs text-green-600 font-semibold">
                                  {mat.discount}% OFF
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-orange-600">
                                ₹{mat.price}
                              </span>
                            )}
                          </div>

                          {userData?.role !== 'seller' && (
                            <>
                              <div className="mb-3">
                                <label className="text-xs text-gray-500 block mb-1">Quantity (kg)</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={quantities[key] || 1}
                                  onChange={(e) => handleQuantityChange(key, e.target.value)}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                                />
                              </div>
                              <button
                                onClick={() => handleOrder(mat, store)}
                                disabled={ordering === key}
                                className="w-full py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                              >
                                {ordering === key ? (
                                  <span className="flex items-center justify-center gap-1">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                  </span>
                                ) : (
                                  'Place Order →'
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(!store.materials || store.materials.length === 0) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No products available from this store</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NearbyStores;