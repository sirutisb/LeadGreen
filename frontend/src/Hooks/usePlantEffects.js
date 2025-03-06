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

export default function usePlantEffects(plantRef) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [sparkColor, setSparkColor] = useState("#248335");
  
  // Sound hooks
  const [playWaterDrop] = useSound(waterDropSound, { volume: 1 });
  const [playsoil] = useSound(soilSound, { volume: 0.7 });
  const [playGlove] = useSound(gloveSound, { volume: 0.6 });
  const [playLevelUp] = useSound(levelSound, { volume: 1.0 });
  const [playInsect] = useSound(snailSound, { volume: 1.0 });
  const [playAlert] = useSound(alertSound, { volume: 0.8 });

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

  const getActionEffects = (action) => {
    switch (action) {
      case "soil":
        return {
          sound: playsoil,
          color: "#805A36"
        };
      case "water":
        return {
          sound: playWaterDrop,
          color: "#94f9ff"
        };
      case "glove":
        return {
          sound: playGlove,
          color: "#FFD700"
        };
      default:
        return null;
    }
  };

  const playActionSound = (action) => {
    const effects = getActionEffects(action);
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