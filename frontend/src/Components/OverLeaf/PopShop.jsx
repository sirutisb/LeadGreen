import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, ShoppingBag, Sparkles, Clock, X, ChevronLeft } from 'lucide-react';
import soilIcon from "../../assets/soil.svg";
import waterIcon from "../../assets/water.svg";
import gloveIcon from "../../assets/glove.svg";
import pesticideIcon from "../../assets/pesticide.svg";
import vitaminIcon from "../../assets/vitamin.svg";
import mineralIcon from "../../assets/fertiliser.svg";

const GardenShop = ({ isOpen, onClose, user, setUser }) => {
  const [animateItems, setAnimateItems] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const modalRef = useRef(null);

  // Gardening items without rarity
  const shopItems = [
    { 
      id: 1, 
      name: "Pesticides", 
      price: 50, 
      icon: pesticideIcon,
      description: "Protect your plants from pests",
      popular: true,
      attributes: [
        { name: "Power", value: 85 },
        { name: "Duration", value: 70 },
        { name: "Eco-friendly", value: 60 }
      ]
    },
    { 
      id: 2, 
      name: "Vitamin D Spray", 
      price: 30, 
      icon: vitaminIcon, 
      description: "Boost plant health with vitamin D",
      new: true,
      attributes: [
        { name: "Absorption", value: 90 },
        { name: "Growth", value: 75 },
        { name: "Coverage", value: 60 }
      ]
    },
    { 
      id: 3, 
      name: "Gloves", 
      price: 15, 
      icon: gloveIcon, 
      description: "Protect your hands while gardening",
      attributes: [
        { name: "Comfort", value: 80 },
        { name: "Protection", value: 70 },
        { name: "Durability", value: 65 }
      ]
    },
    { 
      id: 4, 
      name: "Soil", 
      price: 25, 
      icon: soilIcon, 
      description: "Nutrient-rich soil for better growth",
      attributes: [
        { name: "Nutrients", value: 85 },
        { name: "Drainage", value: 70 },
        { name: "pH Balance", value: 90 }
      ]
    },
    { 
      id: 5, 
      name: "Water", 
      price: 5, 
      icon: waterIcon, 
      description: "Hydrate your plants",
      attributes: [
        { name: "Purity", value: 95 },
        { name: "Minerals", value: 60 },
        { name: "Absorption", value: 80 }
      ]
    },
    { 
      id: 6, 
      name: "Mineral Ferts", 
      price: 40, 
      icon: mineralIcon, 
      description: "Enhance growth with mineral fertilizers",
      attributes: [
        { name: "Potency", value: 90 },
        { name: "Versatility", value: 85 },
        { name: "Long-lasting", value: 75 }
      ]
    }
  ];

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

  // Handle purchase
  const handlePurchase = (item) => {
    if (user.coins >= item.price) {
      const button = document.getElementById(`buy-btn-${item.id}`);
      if (button) {
        button.classList.add("scale-90");
        setTimeout(() => {
          button.classList.remove("scale-90");
        }, 150);
      }
      
      setTimeout(() => {
        alert(`Successfully purchased ${item.name}!`);
        setUser({
          ...user,
          coins: user.coins - item.price
        });
      }, 300);
    } else {
      alert("Not enough coins!");
    }
  };

  // Handle item selection
  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  // Handle close detail view
  const handleCloseDetail = () => {
    setSelectedItem(null);
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

  // Attribute bar component
  const AttributeBar = ({ name, value }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 font-medium">{name}</span>
        <span className="text-gray-600 font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${value}%`, 
            background: `linear-gradient(90deg, #10B981 0%, ${value > 75 ? '#059669' : value > 50 ? '#0EA5E9' : '#6366F1'} 100%)`,
            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)' 
          }}
        ></div>
      </div>
    </div>
  );

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
          <button 
            onClick={handleCloseShop}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-200"
            aria-label="Close shop"
          >
            <X size={18} color="white" />
          </button>
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

        {/* Item Detail View */}
        {selectedItem && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <button 
                onClick={handleCloseDetail}
                className="flex items-center text-emerald-600 hover:text-emerald-800 font-medium"
              >
                <ChevronLeft size={20} />
                <span>Back to Shop</span>
              </button>
            </div>
            <div className="flex flex-col md:flex-row flex-grow overflow-y-auto p-4">
              <div className="md:w-1/2 flex flex-col items-center justify-center p-4">
                <div className="rounded-2xl w-full aspect-square bg-gradient-to-br from-emerald-300 via-emerald-400 to-green-500 flex items-center justify-center p-8 relative group shadow-lg">
                  <img 
                    src={selectedItem.icon} 
                    alt={selectedItem.name}
                    className="w-48 h-48 object-contain animate-float transform transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
                  />
                  {selectedItem.new && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      NEW!
                    </div>
                  )}
                  {selectedItem.popular && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles size={12} /> POPULAR
                    </div>
                  )}
                </div>
                <h3 className="text-gray-800 font-bold text-2xl mt-6 text-center">{selectedItem.name}</h3>
                <p className="text-gray-600 text-center mt-2">{selectedItem.description}</p>
              </div>
              <div className="md:w-1/2 p-4 flex flex-col">
                <div className="bg-gray-50 rounded-xl p-5 mb-4 shadow-sm">
                  <h4 className="text-emerald-600 font-bold mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Item Attributes
                  </h4>
                  {selectedItem.attributes.map((attr, index) => (
                    <AttributeBar key={index} name={attr.name} value={attr.value} />
                  ))}
                </div>
                <div className="mt-auto bg-gray-50 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <p className="text-gray-500 text-sm">Price</p>
                      <p className="text-gray-800 text-2xl font-bold flex items-center">
                        {selectedItem.price} <span className="text-amber-400 ml-2">💰</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm text-right">Your Balance</p>
                      <p className="text-emerald-500 text-xl font-medium">{user?.coins || 100}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePurchase(selectedItem)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-lg font-bold text-md transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    PURCHASE NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <div className="p-4 md:p-6 bg-white overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {shopItems.map((item, index) => (
              <div 
                key={item.id}
                className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-500 ${
                  animateItems ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } hover:scale-103 cursor-pointer group`}
                onClick={() => handleItemSelect(item)}
              >
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-500"></div>
                  <div className="h-40 sm:h-44 md:h-52 flex items-center justify-center bg-gradient-to-b from-gray-50 to-emerald-50 relative">
                    <img 
                      src={item.icon} 
                      alt={item.name}
                      className="w-24 h-24 md:w-28 md:h-28 object-contain animate-float transform transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                    />
                     {item.new && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        NEW!
                      </div>
                    )}
                    {item.popular && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Sparkles size={12} /> POPULAR
                      </div> 
                    )} 
                  </div>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/40 via-black/20 to-transparent p-3 md:p-4">
                    <h3 className="text-green-700 font text-base md:text-lg">{item.name}</h3>
                    <p className="text-white/90 text-xs md:text-sm truncate">{item.description}</p>
                  </div>
                </div>
                <div className="bg-white p-3 flex justify-between items-center border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-amber-400 mr-1">💰</span>
                    <span className="text-gray-700 font-bold">{item.price}</span>
                  </div>
                  <button
                    id={`buy-btn-${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(item);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-emerald-50 p-4 flex justify-between items-center border-t border-gray-200">
          <div>
            <p className="text-gray-500 text-sm">Your balance:</p>
            <p className="text-emerald-600 flex items-center text-base font-semibold">
              {user?.coins || 100} <span className="text-amber-400 ml-1">💰</span>
            </p>
          </div>
          <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-md">
            Get Coins
          </button>
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