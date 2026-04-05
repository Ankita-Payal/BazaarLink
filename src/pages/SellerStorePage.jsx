import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";

const SellerStorePage = () => {
  const { userData } = useAuth();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState({ item: "", price: "", discount: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const q = query(collection(db, "stores"), where("sellerId", "==", userData.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((docSnap) => {
          setStore({ id: docSnap.id, ...docSnap.data() });
        });
      } catch (error) {
        toast.error("Failed to load store");
      } finally {
        setLoading(false);
      }
    };
    if (userData?.uid) fetchStore();
  }, [userData]);

  const updateMaterial = async (index, field, value) => {
    try {
      const updatedMaterials = [...store.materials];
      updatedMaterials[index][field] = field === "item" ? value : Number(value);

      const ref = doc(db, "stores", store.id);
      await updateDoc(ref, { materials: updatedMaterials });
      setStore((prev) => ({ ...prev, materials: updatedMaterials }));
      toast.success("Material updated successfully");
      setEditingIndex(null);
    } catch (error) {
      toast.error("Failed to update material");
    }
  };

  const addMaterial = async () => {
    if (!newMaterial.item || !newMaterial.price) {
      toast.error("Please fill item and price");
      return;
    }

    try {
      const updatedMaterials = [...store.materials, {
        item: newMaterial.item,
        price: Number(newMaterial.price),
        discount: Number(newMaterial.discount) || 0
      }];
      const ref = doc(db, "stores", store.id);
      await updateDoc(ref, { materials: updatedMaterials });
      setStore((prev) => ({ ...prev, materials: updatedMaterials }));
      setNewMaterial({ item: "", price: "", discount: "" });
      toast.success("Material added successfully");
    } catch (error) {
      toast.error("Failed to add material");
    }
  };

  const deleteMaterial = async (index) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      const updatedMaterials = store.materials.filter((_, i) => i !== index);
      const ref = doc(db, "stores", store.id);
      await updateDoc(ref, { materials: updatedMaterials });
      setStore((prev) => ({ ...prev, materials: updatedMaterials }));
      toast.success("Material deleted successfully");
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Store Found</h2>
          <p className="text-gray-500">Please contact admin to set up your store.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{store.name}</h1>
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <span>📍</span> 
                {store.location?.lat}, {store.location?.lng}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="text-xs text-green-700 font-medium">Store Status</p>
              <p className="text-sm font-bold text-green-800">Active ✓</p>
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">📦 Listed Materials</h2>
            <p className="text-xs text-gray-500 mt-1">Manage your inventory and pricing</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Final Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {store.materials?.map((mat, index) => {
                  const finalPrice = mat.price - (mat.price * (mat.discount || 0) / 100);
                  return (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            defaultValue={mat.item}
                            onBlur={(e) => updateMaterial(index, "item", e.target.value)}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                            autoFocus
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{mat.item}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingIndex === index ? (
                          <input
                            type="number"
                            defaultValue={mat.price}
                            onBlur={(e) => updateMaterial(index, "price", e.target.value)}
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm text-gray-700">₹{mat.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingIndex === index ? (
                          <input
                            type="number"
                            defaultValue={mat.discount || 0}
                            onBlur={(e) => updateMaterial(index, "discount", e.target.value)}
                            className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                        ) : (
                          <span className="text-sm text-gray-700">{mat.discount || 0}%</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-green-600">₹{finalPrice.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {editingIndex === index ? (
                            <button
                              onClick={() => setEditingIndex(null)}
                              className="text-gray-400 hover:text-gray-600 transition"
                            >
                              Cancel
                            </button>
                          ) : (
                            <button
                              onClick={() => setEditingIndex(index)}
                              className="text-blue-600 hover:text-blue-700 transition text-sm font-medium"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteMaterial(index)}
                            className="text-red-500 hover:text-red-700 transition text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {store.materials?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-gray-500">No materials added yet</p>
              <p className="text-xs text-gray-400 mt-1">Start by adding your first product below</p>
            </div>
          )}
        </div>

        {/* Add New Material Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Add New Material</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Item name *"
              value={newMaterial.item}
              onChange={(e) => setNewMaterial({ ...newMaterial, item: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
            <input
              type="number"
              placeholder="Price (₹) *"
              value={newMaterial.price}
              onChange={(e) => setNewMaterial({ ...newMaterial, price: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
            <input
              type="number"
              placeholder="Discount (%)"
              value={newMaterial.discount}
              onChange={(e) => setNewMaterial({ ...newMaterial, discount: e.target.value })}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
            <button
              onClick={addMaterial}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Add Material →
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-xs text-blue-600 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-blue-900">{store.materials?.length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs text-green-600 font-medium">Average Price</p>
            <p className="text-2xl font-bold text-green-900">
              ₹{(store.materials?.reduce((sum, m) => sum + m.price, 0) / (store.materials?.length || 1)).toFixed(0)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <p className="text-xs text-orange-600 font-medium">Store Rating</p>
            <p className="text-2xl font-bold text-orange-900">4.8 ⭐</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SellerStorePage;