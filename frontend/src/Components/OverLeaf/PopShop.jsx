import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from "../../Context/axiosInstance";
import { ShoppingBag, Sparkles, Clock, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import greencoinIcon from '../../assets/peng.svg';
import { toastError, toastSuccess } from "../utils/toastCustom";

const GardenShop = ({ isOpen, onClose, user, setUser, onPurchase }) => {
  const [animateItems, setAnimateItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inventory, setInventory] = useState({});
  const [itemQuantities, setItemQuantities] = useState({});
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);

  // Fetch shop items from API
  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/game/items/');
        const data = response.data;
        
        if (data.success && Array.isArray(data.items)) {
          setShopItems(data.items);
          
          // Initialize quantities for all items
          const initialQuantities = {};
          data.items.forEach(item => {
            initialQuantities[item.id] = 1;
          });
          setItemQuantities(initialQuantities);
          
          // Update user coins/points from the API response
          if (data.points !== undefined) {
            setUser(prevUser => ({
              ...prevUser,
              coins: data.points
            }));
          }
        } else {
          setError('Failed to load shop items');
        }
      } catch (err) {
        setError('Error connecting to the shop service');
        console.error('Shop fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchShopItems();
    }
  }, [isOpen]);

  // Initialize inventory on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axiosInstance.get('/api/game/inventory/');
        const inventoryData = {};
        response.data.forEach(item => {
          inventoryData[item.item.id] = item.quantity;
        });
        setInventory(inventoryData);
      } catch (err) {
        console.error('Inventory fetch error:', err);
        toastError('Failed to load inventory');
      }
    };

    if (isOpen && shopItems.length > 0) {
      fetchInventory();
    }
  }, [isOpen, shopItems]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimateItems(true);
      }, 200);
      document.body.style.overflow = 'hidden';
      
      if (modalRef.current) {
        modalRef.current.classList.add('scale-100', 'opacity-100');
        modalRef.current.classList.remove('scale-95', 'opacity-0');
      }
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      setAnimateItems(false);
      setSelectedItem(null);
    }
  }, [isOpen]);

  // Update item quantity
  const updateItemQuantity = (itemId, change) => {
    setItemQuantities(prev => {
      const newQuantity = Math.max(1, (prev[itemId] || 1) + change);
      return { ...prev, [itemId]: newQuantity };
    });
  };

  // // Handle purchase
  // const handlePurchase = async (item) => {
  //   const quantity = itemQuantities[item.id] || 1;
  //   const totalPrice = item.price * quantity;
    
  //   if (user.coins >= totalPrice) {
  //     const button = document.getElementById(`buy-btn-${item.id}`);
  //     if (button) {
  //       button.classList.add("scale-90");
  //       setTimeout(() => {
  //         button.classList.remove("scale-90");
  //       }, 150);
  //     }
      
  //     try {
  //       // Using the actual purchase endpoint with environment variable
  //       const response = await fetch(`${API_BASE_URL}/api/game/items/${item.id}/purchase/`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if needed
  //         },
  //         body: JSON.stringify({
  //           quantity: quantity
  //         })
  //       });
        
  //       const result = await response.json();
        
  //       if (result.success) {
  //         // Update user coins
  //         setUser({
  //           ...user,
  //           coins: user.coins - totalPrice
  //         });
          
  //         // Update inventory
  //         setInventory({
  //           ...inventory,
  //           [item.id]: (inventory[item.id] || 0) + quantity
  //         });
          
  //         // Reset quantity to 1 after purchase
  //         setItemQuantities(prev => ({
  //           ...prev,
  //           [item.id]: 1
  //         }));
          
  //         alert(`Successfully purchased ${quantity} ${item.name}!`);
  //       } else {
  //         alert(result.message || "Purchase failed. Please try again.");
  //       }
  //     } catch (err) {
  //       alert("Purchase failed. Please try again.");
  //       console.error('Purchase error:', err);
  //     }
  //   } else {
  //     alert("Not enough coins!");
  //   }
  // };
  
  const handlePurchase = async (item) => {
    const quantity = itemQuantities[item.id] || 1;
    const totalPrice = item.price * quantity;
    
    if (user.coins >= totalPrice) {
      const button = document.getElementById(`buy-btn-${item.id}`);
      if (button) {
        button.classList.add("scale-90");
        setTimeout(() => {
          button.classList.remove("scale-90");
        }, 150);
      }
      
      try {
        const response = await axiosInstance.post(`/api/game/items/${item.id}/purchase/`, {
          quantity: quantity
        });
        
        const result = response.data;
        
        if (result.success) {
          // Update user coins
          setUser(prevUser => ({
            ...prevUser,
            coins: result.remaining_points
          }));
          
          // Call the callback to update parent's inventory
          if (onPurchase) {
            onPurchase();
          }
          
          toastSuccess(`Successfully purchased ${quantity} ${item.name}!`);
        } else {
          toastError(result.message || "Purchase failed. Please try again.");
        }
      } catch (err) {
        toastError("Purchase failed. Please try again.");
        console.error('Purchase error:', err);
      }
    } else {
      toastError("Not enough coins!");
    }
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  // Handle shop close with animation
  const handleCloseShop = () => {
    if (modalRef.current) {
      modalRef.current.classList.add('scale-95', 'opacity-0');
      modalRef.current.classList.remove('scale-100', 'opacity-100');
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  // Get item effects display
  const getItemEffectsDisplay = (item) => {
    if (!item.effects || item.effects.length === 0) {
      return "No special effects";
    }
    
    return item.effects.map(effect => effect.name).join(", ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-0 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl max-h-full md:max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-300 to-green-600 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingBag className="text-white" size={22} />
            </div>
            <h2 className="text-xl text-white tracking-wide">Garden Shop</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleCloseShop}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
              aria-label="Close shop"
            >
              <X size={18} color="white" />
            </button>
          </div>
        </div>

        {/* Shop Timer */}
        <div className="bg-emerald-50 p-3 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700 font-semibold text-base">Featured Items</span>
          </div>
          <div className="flex items-center text-emerald-700 text-sm font-medium bg-emerald-100/70 px-3 py-1 rounded-full">
            <Clock className="mr-2" size={16} />
            <span>23 HOURS</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="p-4 md:p-6 bg-white overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {shopItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-500 ${
                    animateItems ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  } hover:scale-103 cursor-pointer group`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  onClick={() => handleItemSelect(item)}
                >
                  <div className="relative">
                    <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                    <div className="h-40 sm:h-44 md:h-52 flex items-center justify-center bg-gradient-to-b from-gray-50 to-emerald-50 relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 md:w-28 md:h-28 object-contain animate-float transform transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      {item.item_type === "NEW" && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          NEW!
                        </div>
                      )}
                      {item.item_type === "POPULAR" && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles size={12} /> POPULAR
                        </div> 
                      )}
                      {inventory[item.id] > 0 && (
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-1 py-1 rounded-lg shadow-md">
                          Owned: {inventory[item.id]}
                        </div>
                      )}
                      {item.cooldown_seconds > 0 && (
                        <div className="absolute bottom-3 right-3 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md flex items-center">
                          <Clock size={12} className="mr-1" />
                          {Math.floor(item.cooldown_seconds / 60)}m cooldown
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/30 via-black/20 to-transparent p-3 md:p-4">
                      <h3 className="text-green-700 font text-base md:text-lg">{item.name}</h3>
                      <p className="text-white/90 text-xs md:text-sm truncate">{item.description}</p>
                    </div>
                  </div>
                  <div className="bg-white p-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-1 truncate">
                      {item.effects && item.effects.length > 0 ? 
                        `Effects: ${getItemEffectsDisplay(item)}` : 
                        `Type: ${item.item_type}`
                      }
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700 font-bold">{item.price * (itemQuantities[item.id] || 1)}</span>
                        <img 
                          src={greencoinIcon} 
                          className="w-6 h-6 object-contain"
                          alt="Coins"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, -1);
                            }}
                            className="p-1 hover:bg-gray-200 text-gray-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-0.5 text-black font-small">{itemQuantities[item.id] || 1}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              updateItemQuantity(item.id, 1);
                            }}
                            className="p-1 hover:bg-gray-200 text-gray-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          id={`buy-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(item);
                          }}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                          disabled={item.price === 0}
                        >
                          {item.price === 0 ? 'FREE' : 'BUY'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-emerald-50 p-4 flex justify-between items-center border-t border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Your balance:</p>
            <p className="text-emerald-600 flex items-center text-base font-semibold">
              <span>{user?.coins || 0}</span>
              <img 
                src={greencoinIcon} 
                className="w-7 h-7 object-contain"
              />
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-md"
              onClick={() => window.location.href = "/#lead-points"}
            >
              Get Coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Button to open shop
GardenShop.ShopButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 md:top-38 right-4 md:right-[20px] bg-green-100 hover:from-emerald-500 hover:to-green-600 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
      aria-label="Open Shop"
    >
      <div className="absolute w-full h-full rounded-full bg-green opacity-20 animate-ping-slow"></div>
      <ShoppingCart size={24} className="text-green-500" />
    </button>
  );
};

export default GardenShop;