import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import useSound from "use-sound";
import mojs from "@mojs/core";
import OverLeafBar from "./OverLeafBar";
import waterDropSound from "../../assets/sounds/drop.mp3";
import snailSound from "../../assets/sounds/snail.mp3";
import alertSound from "../../assets/sounds/alert.mp3";
import soilSound from "../../assets/sounds/soil.mp3";
import gloveSound from "../../assets/sounds/glove.mp3";
import levelSound from "../../assets/sounds/level.mp3";
import RouletteButton from "./RouletteButton";
import { toastError, toastSuccess, toastWarning } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance";

const OverLeaf = () => {
  const [user, setUser] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentInsect, setCurrentInsect] = useState(null);
  const [prevLevel, setPrevLevel] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [sparkColor, setSparkColor] = useState("#248335");
  const plantRef = useRef(null);

  const [playWaterDrop] = useSound(waterDropSound, { volume: 1 });
  const [playsoil] = useSound(soilSound, { volume: 0.7 });
  const [playGlove] = useSound(gloveSound, { volume: 0.6 });
  const [playLevelUp] = useSound(levelSound, { volume: 1.0 });
  const [playInsect] = useSound(snailSound, { volume: 1.0 });
  const [playAlert] = useSound(alertSound, { volume: 0.8 });

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

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/game");
      const data = response.data;
// Update user state
      const updatedUser = {
        points_balance: data.points_balance,
        tree_level: data.tree.level,
        plant_name: data.tree.name,
        plant_image: data.tree.image,
        spins: data.spins_remaining,
        has_insect: !!data.insect,
        insect: data.insect || null,
      };

      setUser(updatedUser);
      setScale(1 + data.plant.growth);
// Handle insect logic
      if (data.insect) {
        handleInsect(data.insect);
      } else {
        setCurrentInsect(null);
      }

      setPrevLevel(data.tree.level);
      setInitialLoad(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toastError("Failed to load user data!");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
// Handle insect event
  const handleInsect = (insectData) => {
    if (insectData) {
      if (!currentInsect || currentInsect.name !== insectData.name) {
        setCurrentInsect({ name: insectData.name, image: insectData.image || "" });
        playInsect();
        toastWarning(`${insectData.name} is blocking your tree! Use the glove to remove it.`);
      }
    } else {
      setCurrentInsect(null);
    }
  };
// Trigger level-up animation and refresh data
  const handleLevelUp = () => {
    toastSuccess(`🎉 Congratulations! Your ${user?.plant_name} leveled up!`);
    playLevelUp();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    setScale(1);

    if (burst.current) {
      burst.current.replay();
    }

    fetchUserData();
  };

  useEffect(() => {
    if (!initialLoad && user?.tree_level > prevLevel) {
      handleLevelUp();
    }
    setPrevLevel(user?.tree_level);
  }, [user?.tree_level, initialLoad, prevLevel]);
  // Handle soil, water, and glove actions
  const handleAction = async () => {
    if (!selectedIcon) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
      return;
    }

    let endpoint = "";
    let soundEffect = null;
    let sparkColor = "";

    switch (selectedIcon) {
      case "soil":
        endpoint = "/game/tree/soil/";
        soundEffect = playsoil;
        sparkColor = "#805A36";
        break;
      case "water":
        endpoint = "/game/tree/water/";
        soundEffect = playWaterDrop;
        sparkColor = "#94f9ff";
        break;
      case "glove":
        endpoint = "/game/tree/glove/";
        soundEffect = playGlove;
        sparkColor = "#FFD700";
        break;
    }

    try {
      const response = await axiosInstance.post(endpoint);
      const data = response.data;

      if (data.success) {
        setUser(prev => ({
          ...prev,
          points_balance: data.points_balance,
          tree_level: data.tree.level,
          plant_image: data.tree.image, 
          has_insect: !!data.insect,
          insect: data.insect || null
        }));

        setSparkColor(sparkColor);
        setScale(Math.round((1 + data.tree.growth) * 100) / 100);
        
        if (soundEffect) soundEffect();

        if (data.insect) {
          handleInsect(data.insect);
        } else {
          setCurrentInsect(null);
        }
      } else {
        playAlert();
        toastError(data.message);
      }
    } catch (error) {
      playAlert();
      if (error.response?.data?.message) {
        toastError(error.response.data.message);
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      {showConfetti && <Confetti numberOfPieces={200} />}

      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-6 lg:px-8 relative">
        <OverLeafBar setSelectedIcon={setSelectedIcon} />
        <RouletteButton user={user} setUser={setUser} />

        <motion.div
          ref={plantRef}
          animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative sm:mt-8 md:mt-10 lg:mt-12"
          onClick={handleAction}
        >
          <motion.img 
            src={import.meta.env.VITE_BACKEND + user.plant_image}
            alt={user.plant_name}
            className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-20"
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            draggable={false}
          />

          {currentInsect && (
            <motion.img
              src={import.meta.env.VITE_BACKEND + currentInsect.image}
              alt={currentInsect.name}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          )}
        </motion.div>

        <div className="absolute top-8 left-5 sm:top-5 sm:right-5 bg-[#DEFDE9] px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-md w-fit">
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌿 Plant: {user.plant_name}</p>
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
          <p className="text-[#1B6630] text-sm sm:text-base font-semibold">💰 Points: {user.points_balance}</p>
        </div>
      </div>
    </div>
  );
};

export default OverLeaf;