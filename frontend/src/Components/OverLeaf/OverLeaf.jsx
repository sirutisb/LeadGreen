import React, { useRef, useEffect, useState } from "react";
import OverLeafBar from "./OverLeafBar";
import RouletteButton from "./RouletteButton";
import PlantDisplay from "./PlantDisplay";
import StatsDisplay from "./StatsDisplay";
import ConfettiEffect from "./ConfettiEffect";
import useGameData from "../../Hooks/useGameData";
import usePlantEffects from "../../Hooks/usePlantEffects";
const OverLeaf = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const plantRef = useRef(null);

  // 🔹 Inventory data stored in OverLeaf
  const [inventory, setInventory] = useState([
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
    { id: "soil", label: "Soil", tooltip: "Helps plant growth x3", amount: 5 },
    { id: "water", label: "Water", tooltip: "Grow plant, increase size", amount: 3 },
    { id: "glove", label: "Glove", tooltip: "Removes insects", amount: 2 },
  ]);

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

  useEffect(() => {
    if (currentInsect && initialLoad === false) {
      showInsectAlert(currentInsect.name);
    }
  }, [currentInsect?.name]);

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

    const result = await executeAction(selectedIcon);
    console.log(result)
    if (result.success) {
      playActionSound(selectedIcon);

      setInventory((prev) =>
        prev
          .map((i) => (i.id === selectedIcon ? { ...i, amount: i.amount - 1 } : i))
          .filter((i) => i.amount > 0) // Remove item when amount reaches 0
      );

      if (item.amount - 1 <= 0) {
        setSelectedIcon(null);
      }
    } else {
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
      </div>
    </div>
  );
};

export default OverLeaf;
