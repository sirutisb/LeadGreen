import React, { useRef, useEffect, useState } from "react";
import OverLeafBar from "./OverLeafBar";
import RouletteButton from "./RouletteButton";
import PlantDisplay from "./PlantDisplay";
import StatsDisplay from "./StatsDisplay";
import ConfettiEffect from "./ConfettiEffect";
import useGameData from "../../Hooks/useGameData";
import usePlantEffects from "../../Hooks/usePlantEffects";
import GardenShop from "./PopShop";
import { fetchInventory } from "./gameService";
// Use <PopShop /> for the popup and <PopShop.ShopButton /> for the button
import DailyRewards from "./DailyRewards/DailyRewards";

const OverLeaf = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [shopOpen, setShopOpen] = useState(false);
  const plantRef = useRef(null);
  const [inventory, setInventory] = useState([]);

  // Fetch inventory data
  const loadInventory = async () => {
    try {
      const data = await fetchInventory();
      const formattedInventory = data.map(item => ({
        id: item.item.id,
        label: item.item.name,
        amount: item.quantity,
        image: item.item.image
      }));
      setInventory(formattedInventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const {
    user,
    setUser,
    loading,
    currentInsect,
    fetchUserData,
    executeAction,
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

  useEffect(() => {
    if (leveledUp && oldPlantName) {
      showLevelUpEffects(oldPlantName);
      setLeveledUp(false);
    }
  }, [leveledUp, oldPlantName, showLevelUpEffects, setLeveledUp]);

  // Track previous insect for comparison
  const prevInsectRef = useRef(null);

  useEffect(() => {
    if (currentInsect && initialLoad === false) {
      // Only show alert if it's a new insect (different from previous)
      if (!prevInsectRef.current || prevInsectRef.current.name !== currentInsect.name) {
        showInsectAlert(currentInsect.name);
      }
    }
    prevInsectRef.current = currentInsect;
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

    // Optimistically update the inventory
    setInventory(prev =>
      prev.map(i => i.id === selectedIcon 
        ? { ...i, amount: i.amount - 1 }
        : i
      ).filter(i => i.amount > 0)
    );

    const result = await executeAction(selectedIcon);
    
    if (result.success) {
      playActionSound(selectedIcon);

      // Verify inventory state
      const serverInventory = await fetchInventory();
      const serverItem = serverInventory.find(i => i.item.id === selectedIcon);
      if (!serverItem || serverItem.quantity !== item.amount - 1) {
        const formattedInventory = serverInventory.map(item => ({
          id: item.item.id,
          label: item.item.name,
          amount: item.quantity,
          image: item.item.image
        }));
        setInventory(formattedInventory);
      }

      if (item.amount - 1 <= 0) {
        setSelectedIcon(null);
      }
    } else {
      // If action failed, revert the optimistic update
      await loadInventory();
      playErrorSound();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ConfettiEffect show={showConfetti} />

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
        <OverLeafBar setSelectedIcon={setSelectedIcon} inventory={inventory} selectedIcon={selectedIcon} />
        <RouletteButton user={user} setUser={setUser} />
        <DailyRewards setUser={setUser} setInventory={setInventory}/>
        
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
          onPurchase={loadInventory}
        />
      </div>
    </div>
  );
};

export default OverLeaf;