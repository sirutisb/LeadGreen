import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { VFXProvider } from "react-vfx";
import useSound from "use-sound";
import mojs from "@mojs/core"; 
import OverLeafBar from "./OverLeafBar";
import plants from "../../assets/plants"; 
import insects from "../../assets/insects"; 

import waterDropSound from "../../assets/sounds/drop.mp3";
import snailSound from "../../assets/sounds/snail.mp3";
import alertSound from "../../assets/sounds/alert.mp3";
import soilSound from "../../assets/sounds/soil.mp3";
import gloveSound from "../../assets/sounds/glove.mp3";
import levelSound from "../../assets/sounds/level.mp3";
import RouletteButton from "./RouletteButton";

const OverLeaf = () => {
  const [user, setUser] = useState({
    points_balance: 1000,
    tree_level: 1,
    spins: 5
  });

  const [scale, setScale] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentInsect, setCurrentInsect] = useState(null);
  const [prevLevel, setPrevLevel] = useState(Math.floor(user.tree_level));
  const [showConfetti, setShowConfetti] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [sparkColor, setSparkColor] = useState("#248335");
  const plantRef = useRef(null); 

  // 🎵 Load sounds
  const [playWaterDrop] = useSound(waterDropSound, { volume: 1 });
  const [playsoil] = useSound(soilSound, { volume: 0.7 });
  const [playGlove] = useSound(gloveSound, { volume: 0.6 });
  const [playLevelUp] = useSound(levelSound, { volume: 1.0 });
  const [playInsect] = useSound(snailSound, { volume: 1.0 });
  const [playAlert] = useSound(alertSound, { volume: 0.8 });

  // 🌟 Mo.js burst animation
  const burst = useRef(null);

  useEffect(() => {
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
  }, []);

  const handleLevelUp = () => {
    const currentPlant = plants[Math.min(Math.floor(user.tree_level) - 1, plants.length - 1)];
    toast.success(`🎉 Congratulations! Your ${currentPlant.name} leveled up!`, { theme: "colored" });
    playLevelUp();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    setScale(1);

    if (burst.current) {
      burst.current.replay();
    }
  };

  const handleInsectAppearance = (level) => {
    // Adjust the calculation to start from insect1 at level 5
    const insectIndex = Math.floor(level / 5) - 1;
    const newInsect = insects[insectIndex % insects.length];
    
    setCurrentInsect(newInsect);
    playInsect();
    toast.warning(`${newInsect.name} has appeared! Use the glove to remove it.`, { theme: "colored" });
  };

  useEffect(() => {
    const newLevelInt = Math.floor(user.tree_level);
    const prevLevelInt = Math.floor(prevLevel);

    if (newLevelInt !== prevLevelInt) {
      handleLevelUp();
    }

    if (newLevelInt % 5 === 0 && newLevelInt !== prevLevelInt) {
      handleInsectAppearance(newLevelInt);
    }

    setPrevLevel(user.tree_level);
  }, [user.tree_level]);

  const handleAction = () => {
    if (!selectedIcon) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
      return; // 🔹 If no icon selected, just wiggle the plant and do nothing.
    }
  
    if (user.points_balance <= 0) {
      playAlert();
      toast.error("❌ Not enough points to perform this action!", { theme: "colored" });
      return; // 🔹 Only trigger error when an icon is selected and points are 0.
    }
  
    if (currentInsect && selectedIcon !== "glove") {
      playAlert();
      toast.error(`${currentInsect.name} is blocking your plant! Use the glove first.`, { theme: "colored" });
      return;
    }
  
    let growth = 0;
    if (selectedIcon === "soil" && user.points_balance >= 20) {
      setUser((prev) => ({
        ...prev,
        points_balance: prev.points_balance - 20,
        tree_level: prev.tree_level + 0.3,
      }));
      growth = 0.3;
      playsoil();
      setSparkColor("#805A36");
    } else if (selectedIcon === "water" && user.points_balance >= 10) {
      setUser((prev) => ({
        ...prev,
        points_balance: prev.points_balance - 10,
        tree_level: prev.tree_level + 0.1,
      }));
      growth = 0.1;
      playWaterDrop();
      setSparkColor("#94f9ff");
    } else if (selectedIcon === "glove") {
      if (user.points_balance >= 50 && currentInsect) {
        setUser((prev) => ({
          ...prev,
          points_balance: prev.points_balance - 50,
          tree_level: prev.tree_level + 0.1,
        }));
        setCurrentInsect(null);
        growth = 0.1;
        playGlove();
        setSparkColor("#FFD700");
        toast.success(`${currentInsect.name} removed successfully!`, { theme: "colored" });
      } else if (!currentInsect) {
        playAlert();
        toast.error("😭 The plant is already cleaned!", { theme: "colored" });
      } else {
        playAlert();
        toast.error("❌ Not enough points to remove the pest!", { theme: "colored" });
      }
    } else {
      playAlert();
      toast.error("❌ Not enough points to perform this action!", { theme: "colored" });
    }
  
    if (growth > 0) {
      setScale((prevScale) => prevScale + growth);
    }
  };  
  

  const getCurrentPlant = () => {
    const plantIndex = Math.min(Math.floor(user.tree_level) - 1, plants.length - 1);
    return {
      image: plants[plantIndex].plant,
      name: plants[plantIndex].name
    };
  };


  return (
    <VFXProvider>
      {showConfetti && <Confetti numberOfPieces={200} />}
      <div className={`flex flex-col items-center justify-center min-h-screen max- relative`}>
        <OverLeafBar setSelectedIcon={setSelectedIcon} />
        <RouletteButton user={user} setUser={setUser} />

        {/* 🌱 Plant Container */}
        <motion.div
          ref={plantRef}
          animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative -mt-30"
          onClick={handleAction}
        >
          <motion.img
            src={getCurrentPlant().image}
            alt={getCurrentPlant().name}
            className="w-[150px] h-[150px]"
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            draggable={false}
          />

          {/* 🐛 Insect Display */}
          {currentInsect && (
            <motion.img
              src={currentInsect.insect}
              alt={currentInsect.name}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          )}
        </motion.div>

        {/* 📊 Stats UI */}
        <div className="absolute top-5 right-5 bg-[#DEFDE9] px-4 py-2 rounded-lg shadow-md">
          <p className="text-[#1B6630] font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
          <p className="text-[#1B6630] font-semibold">💰 Points: {user.points_balance}</p>
          <p className="text-[#1B6630] font-semibold">🌿 Plant: {getCurrentPlant().name}</p>
        </div>
      </div>
    </VFXProvider>
  );
};

export default OverLeaf;