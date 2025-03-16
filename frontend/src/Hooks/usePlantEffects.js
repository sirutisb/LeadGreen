import { useState, useEffect, useRef } from "react";
import useSound from "use-sound";
import mojs from "@mojs/core";
import { toastSuccess, toastWarning } from "../Components/utils/toastCustom";

// Import sounds
import waterDropSound from "../assets/sounds/drop.mp3";
import snailSound from "../assets/sounds/snail.mp3";
import alertSound from "../assets/sounds/alert.mp3";
import soilSound from "../assets/sounds/soil.mp3";
import gloveSound from "../assets/sounds/glove2.mp3";
import levelSound from "../assets/sounds/level.mp3";

// Sound configuration mapping using item IDs
const ITEM_EFFECTS = {
  1: { sound: waterDropSound, volume: 1.0, color: "#94f9ff" },  // Water
  2: { sound: soilSound, volume: 0.7, color: "#805A36" },       // Soil
  3: { sound: gloveSound, volume: 0.6, color: "#FFD700" }       // Glove
};

export default function usePlantEffects(plantRef) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [sparkColor, setSparkColor] = useState("#248335");
  
  // Sound hooks for non-item sounds
  const [playLevelUp] = useSound(levelSound, { volume: 1.0 });
  const [playInsect] = useSound(snailSound, { volume: 1.0 });
  const [playAlert] = useSound(alertSound, { volume: 0.8 });

  // Create sound hooks for items
  const soundHooks = {};
  Object.entries(ITEM_EFFECTS).forEach(([itemId, config]) => {
    const [play] = useSound(config.sound, { volume: config.volume });
    soundHooks[itemId] = play;
  });

  // Animation setup
  const burst = useRef(null);
  
  useEffect(() => {
    if (plantRef.current) {
      burst.current = new mojs.Burst({
        parent: plantRef.current,
        radius: { 0: 100 },
        count: 8,
        children: {
          shape: "polygon",
          fill: { "cyan": "yellow" },
          radius: 15,
          rotate: { 360: 0 },
          duration: 1000,
        },
      });
    }
  }, [plantRef]);

  const triggerWiggle = () => {
    setWiggle(true);
    setTimeout(() => setWiggle(false), 500);
  };

  const showLevelUpEffects = (plantName) => {
    toastSuccess(`🎉 Congratulations! Your ${plantName} leveled up!`);
    playLevelUp();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);

    if (burst.current) {
      burst.current.replay();
    }
  };

  const getActionEffects = (itemId) => {
    const itemConfig = ITEM_EFFECTS[itemId];
    if (itemConfig) {
      return {
        sound: soundHooks[itemId],
        color: itemConfig.color
      };
    }
    return null;
  };

  const playActionSound = (itemId) => {
    const effects = getActionEffects(itemId);
    if (effects) {
      effects.sound();
      setSparkColor(effects.color);
    }
  };

  const showInsectAlert = (insectName) => {
    playInsect();
    toastWarning(`${insectName} is blocking your tree! Use the glove to remove it.`);
  };

  const playErrorSound = () => {
    playAlert();
  };

  return {
    showConfetti,
    wiggle,
    sparkColor,
    triggerWiggle,
    showLevelUpEffects,
    playActionSound,
    showInsectAlert,
    playErrorSound
  };
}