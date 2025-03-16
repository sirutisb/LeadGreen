import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import OverLeafBar from "./OverLeafBar";
import RouletteButton from "./RouletteButton";
import PlantDisplay from "./PlantDisplay";
import StatsDisplay from "./StatsDisplay";
import ConfettiEffect from "./ConfettiEffect";
import useGameData from "../../Hooks/useGameData";
import usePlantEffects from "../../Hooks/usePlantEffects";
import GardenShop from "./PopShop";
import DailyRewards from "./DailyRewards/DailyRewards";
import axiosInstance from "../../Context/axiosInstance";

const OverLeaf = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const plantRef = useRef(null);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);

  const {
    user,
    setUser,
    loading,
    currentInsect,
    fetchUserData,
    scale,
    prevLevel,
    initialLoad,
    leveledUp,
    setLeveledUp,
    oldPlantName,
  } = useGameData();

  const {
    showConfetti,
    wiggle,
    triggerWiggle,
    showLevelUpEffects,
    playActionSound,
    showInsectAlert,
    playErrorSound,
  } = usePlantEffects(plantRef);

  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setInventoryLoading(true);
        const response = await axiosInstance.get('/game/inventory/');
        // Map API response to the format expected by the OverLeafBar component
        const formattedInventory = response.data.map(item => ({
          id: item.item.id.toString(),
          label: item.item.name,
          tooltip: item.item.description,
          amount: item.quantity,
          image: item.item.image,
          effects: item.item.effects,
          itemType: item.item.item_type,
          cooldown: item.item.cooldown_seconds
        }));
        
        setInventory(formattedInventory);
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setInventoryLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Update inventory from response
  const updateInventoryFromResponse = (inventoryData) => {
    const formattedInventory = inventoryData.map(item => ({
      id: item.item.id.toString(),
      label: item.item.name,
      tooltip: item.item.description,
      amount: item.quantity,
      image: item.item.image,
      effects: item.item.effects,
      itemType: item.item.item_type,
      cooldown: item.item.cooldown_seconds
    }));
    
    setInventory(formattedInventory);
  };

  useEffect(() => {
    if (leveledUp && oldPlantName) {
      showLevelUpEffects(oldPlantName);
      setLeveledUp(false);
    }
  }, [leveledUp, oldPlantName, showLevelUpEffects, setLeveledUp]);

  useEffect(() => {
    if (currentInsect && initialLoad === false) {
      showInsectAlert(currentInsect.name);
    }
  }, [currentInsect, initialLoad, showInsectAlert]);

  const handleAction = async () => {
    if (!selectedIcon) {
      triggerWiggle();
      return;
    }

    // Find the selected item in inventory
    const item = inventory.find((i) => i.id === selectedIcon);
    
    if (!item || item.amount <= 0) {
      setSelectedIcon(null); 
      triggerWiggle();
      return;
    }

    try {
      // Call the API to use the item
      const response = await axiosInstance.post(`/game/use-item/${selectedIcon}/`);
      const result = response.data;
      
      if (result.success) {
        // Play the appropriate sound
        playActionSound(item.id);
        
        // Update the inventory from the response
        updateInventoryFromResponse(result.inventory);
        // Update user data with the response
        setUser(prevUser => ({
          ...prevUser,
          points: result.points_balance,
          plant_name: result.tree.name,
          plant_level: result.tree.level,
          plant_growth: result.tree.growth,
          plant_image: result.tree.image,
          spins: result.spins
        }));
        console.log(user)

        // If the insect was removed or changed, update it
        if (result.insect !== currentInsect) {
          // If your useGameData hook has a setter for currentInsect, use it here
          // setCurrentInsect(result.insect);
          // Otherwise, you might need to fetch user data again
          fetchUserData();
        }

        // Check if this item is now depleted
        const updatedQuantity = result.inventory.find(i => i.item.id.toString() === selectedIcon)?.quantity || 0;
        if (updatedQuantity <= 0) {
          setSelectedIcon(null);
        }
        
        // Display any message from the backend
        if (result.message) {
          console.log(result.message);
          // You could add a toast notification here
        }
      } else {
        // If the action failed, play error sound
        playErrorSound();
        console.error("Action failed:", result.message);
      }
    } catch (error) {
      playErrorSound();
      console.error("Error using item:", error);
    }
  };

  // Function to refresh inventory and user data
  const refreshGameData = async () => {
    try {
      await fetchUserData();
      const response = await axios.get('/api/game/inventory/');
      
      updateInventoryFromResponse(response.data);
    } catch (error) {
      console.error("Failed to refresh game data:", error);
    }
  };

  if (loading || inventoryLoading) return <div>Loading...</div>;

  return (
    <div>
      <ConfettiEffect show={showConfetti} />

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
        <OverLeafBar setSelectedIcon={setSelectedIcon} inventory={inventory} selectedIcon={selectedIcon} />
        <RouletteButton user={user} setUser={setUser} onSpinComplete={refreshGameData} />
        <DailyRewards onRewardClaimed={refreshGameData} />
        
        <PlantDisplay
          plantRef={plantRef}
          wiggle={wiggle}
          scale={scale}
          plantImage={user.plant_image}
          plantName={user.plant_name}
          insect={currentInsect}
          onClick={handleAction}
        />

        <StatsDisplay user={user} />
        
        {/* Shop integration from PopShop branch */}
        <GardenShop.ShopButton onClick={() => setShopOpen(true)} />
        
        {/* Shop popup from PopShop branch */}
        <GardenShop 
          isOpen={shopOpen} 
          onClose={() => setShopOpen(false)} 
          user={user}
          setUser={setUser}
          refreshGameData={refreshGameData}
        />
      </div>
    </div>
  );
};

export default OverLeaf;