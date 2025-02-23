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
import { toastError, toastSuccess, toastWarning } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance"; // ✅ Import Axios instance

const OverLeaf = () => {
    const [user, setUser] = useState(null);

  const [scale, setScale] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentInsect, setCurrentInsect] = useState(null);
  const [prevLevel, setPrevLevel] = useState(0); // ✅ Store the previous level
    const [initialLoad, setInitialLoad] = useState(true);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/game/gameprofile");
        const data = response.data;
  
        setUser({
          points_balance: data.points_balance,
          tree_level: data.plant.level,
          spins: data.spins_remaining,
          has_insect: data.insect !== null
        });

        setScale(Math.round((1 + data.plant.growth) * 100) / 100); // ✅ Set initial scale using growth from API

        if (data.insect) {
          setCurrentInsect(insects[0]); // ✅ Assign the first insect (snail)
          playInsect();
          toastWarning(`${insects[0].name} has appeared! Use the glove to remove it.`);
        }
  
        setPrevLevel(data.plant.level);
        setInitialLoad(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toastError("❌ Failed to load user data!");
      }
    };
  
    fetchUserData();
}, []);

const handleLevelUp = () => {
    const currentPlant = plants[Math.min(Math.floor(user.tree_level) - 1, plants.length - 1)];
    toastSuccess(`🎉 Congratulations! Your ${currentPlant.name} leveled up!`);
    playLevelUp();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    
    setScale(1); // ✅ Reset size after level-up!

    if (burst.current) {
      burst.current.replay();
    }
};


  const handleInsect = () => {
    if (user?.has_insect) {
        const newInsect = insects[0]; // Select the first insect (snail)
        setCurrentInsect(newInsect);
        playInsect();
        toastWarning(`${newInsect.name} has appeared! Use the glove to remove it.`);
      } else {
        setCurrentInsect(null);
      }
  }
  useEffect(() => {
    handleInsect()
  }, [user?.has_insect]);

  useEffect(() => {
    if (!initialLoad && Math.floor(user.tree_level) > Math.floor(prevLevel)) {
      handleLevelUp();
    }
    setPrevLevel(user?.tree_level); // ✅ Only update when we detect a real change
  }, [user?.tree_level]);

  // ✅ Handles Actions (Water, Soil, Glove)
  const handleAction = async () => {
    if (!selectedIcon) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
      return;
    }

    let endpoint = "";
    let soundEffect = null;
    let sparkColor = "";

    if (selectedIcon === "soil") {
      endpoint = "/game/tree/soil/";
      soundEffect = playsoil;
      sparkColor = "#805A36";
    } else if (selectedIcon === "water") {
      endpoint = "/game/tree/water/";
      soundEffect = playWaterDrop;
      sparkColor = "#94f9ff";
    } else if (selectedIcon === "glove") {
      endpoint = "/game/tree/glove/";
      soundEffect = playGlove;
      sparkColor = "#FFD700";
    }

    try {
      const response = await axiosInstance.post(endpoint);
      const data = response.data;

      if (data.success) {

        setUser((prev) => ({
          ...prev,
          points_balance: data.points_balance,
          tree_level: data.tree_level,
          has_insect: data.has_insect, // ✅ Now updates the insect status
        }));

        soundEffect && soundEffect();
        setSparkColor(sparkColor);
        setScale((prevScale) => prevScale + 0.1);
      } else {
        playAlert();
        toastError(data.message);
      }
    } catch (error) {
      playAlert();
      if (error.response && error.response.data && error.response.data.message) {
        toastError(error.response.data.message);
      } else {
        toastError("❌ Network error! Try again.");
      }
    }
  };
  
  

  const getCurrentPlant = () => {
    if (!user) {
      return { image: plants[0].plant, name: plants[0].name }; // ✅ Prevents crash
    }
    
    const plantIndex = Math.min(Math.floor(user.tree_level) - 1, plants.length - 1);
    return {
      image: plants[plantIndex].plant,
      name: plants[plantIndex].name
    };
  };
  
  // ✅ Use the safe function
  const currentPlant = getCurrentPlant();


  return !user? <div>Loading...</div> : (
    <div>
      {showConfetti && <Confetti numberOfPieces={200} />}
  
      {/* 🌿 Main Container */}
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
        <OverLeafBar setSelectedIcon={setSelectedIcon} />
        <RouletteButton user={user} setUser={setUser} />
  
        {/* 🌱 Plant Container */}
        <motion.div
          ref={plantRef}
          animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative sm:mt-8 md:mt-10 lg:mt-12"
          onClick={handleAction}
        >
          <motion.img
            src={currentPlant.image}
            alt={currentPlant.name}
            className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-20"
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            draggable={false}
          />
  
          {/* 🐛 Insect Display */}
          {currentInsect && (
            <motion.img
              src={currentInsect.insect}
              alt={currentInsect.name}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          )}
        </motion.div>
  
        {/* 📊 Stats UI */}
        <div className="absolute top-8 left-5 sm:top-5 sm:right-5 bg-[#DEFDE9] px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-md w-fit">
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌿 Plant: {getCurrentPlant().name}</p>
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">💰 Points: {user.points_balance}</p>
        </div>
      </div>
    </div>
  );
  
};

export default OverLeaf;