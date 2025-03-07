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
      oldPlantName
    } = useGameData();
  
    const {
      showConfetti,
      wiggle,
      triggerWiggle,
      showLevelUpEffects,
      playActionSound,
      showInsectAlert,
      playErrorSound
    } = usePlantEffects(plantRef);
  
    // Handle level up effect
    useEffect(() => {
      if (leveledUp && oldPlantName) {
        // Now we use the previously stored plant name
        showLevelUpEffects(oldPlantName);
        setLeveledUp(false); // Reset the flag
      }
    }, [leveledUp, oldPlantName, showLevelUpEffects, setLeveledUp]);
  
    // Handle initial insect notification
    useEffect(() => {
      if (currentInsect) {
        showInsectAlert(currentInsect.name);
      }
    }, [currentInsect, showInsectAlert]);
  
    // Handle plant action
    const handleAction = async () => {
      if (!selectedIcon) {
        triggerWiggle();
        return;
      }
  
      const result = await executeAction(selectedIcon);
      
      if (result.success) {
        playActionSound(selectedIcon);
      } else {
        playErrorSound();
      }
    };
  
    if (loading) return <div>Loading...</div>;
  
    return (
      <div>
        <ConfettiEffect show={showConfetti} />
  
        <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
          <OverLeafBar setSelectedIcon={setSelectedIcon} />
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