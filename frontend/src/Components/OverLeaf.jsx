import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { VFXProvider } from "react-vfx";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import "react-toastify/dist/ReactToastify.css";
import plant1 from "../assets/plant.svg";
import plant2 from "../assets/plant2.svg";
import plant3 from "../assets/plant3.svg";
import snail from "../assets/snail.svg";
import OverLeafBar from "./OverLeafBar";
import cursors from "../assets/cursors";

const plants = [plant1, plant2, plant3];

const OverLeaf = () => {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [snailExists, setSnailExists] = useState(false);
  const [scale, setScale] = useState(1);
  const [prevLevel, setPrevLevel] = useState(1);
  const [user, setUser] = useState({
    points_balance: 1000,
    tree_level: 1,
  });

  const getPlantImage = () => {
    if (user.tree_level >= 3) return plants[2];
    if (user.tree_level >= 2) return plants[1];
    return plants[0];
  };

  useEffect(() => {
    const newLevelInt = Math.floor(user.tree_level);
    const prevLevelInt = Math.floor(prevLevel);

    if (newLevelInt % 5 === 0 && newLevelInt !== prevLevelInt) {
      setSnailExists(true);
      toast.warning("🐌 A snail has appeared! Use the glove to remove it.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }

    setPrevLevel(user.tree_level);
  }, [user.tree_level]);

  const handleGrow = () => {
    if (!selectedIcon) return;

    if (snailExists && selectedIcon !== "glove") {
      toast.error("🐌 The snail is blocking growth! Use the glove first.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    let cost = 0;
    let sizeIncrease = 0;
    let levelIncrease = 0;

    if (selectedIcon === "ferm") {
      cost = 30;
      sizeIncrease = 0.3;
      levelIncrease = 0.3;
    } else if (selectedIcon === "water") {
      cost = 10;
      sizeIncrease = 0.1;
      levelIncrease = 0.1;
    } else if (selectedIcon === "glove") {
      cost = 50;
      sizeIncrease = 0.1;
      levelIncrease = 0.1;

      if (snailExists) {
        setSnailExists(false);
        toast.success("🐌 Snail removed! Your tree can grow again!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }

    if (user.points_balance >= cost) {
      const newLevel = user.tree_level + levelIncrease;

      setUser((prev) => ({
        ...prev,
        points_balance: prev.points_balance - cost,
        tree_level: newLevel,
      }));

      if (Math.floor(user.tree_level) < Math.floor(newLevel)) {
        setScale(1);
        setShowConfetti(true);
        toast.success(`🎉 Congratulations! Your tree reached Level ${Math.floor(newLevel)}!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setScale((prev) => prev + sizeIncrease);
      }
    } else {
      toast.error("Not enough points!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  const cursorStyle = {
    cursor: selectedIcon ? cursors[selectedIcon] : "pointer",
  };

  return (
    <VFXProvider>
      {showConfetti && <Confetti />}
      <div 
        className="flex flex-col items-center justify-center relative h-screen w-full bg-cover bg-center overflow-hidden"
        style={{ 
            backgroundImage: "url('/garden.png')", 
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            cursor: selectedIcon ? cursors[selectedIcon] : "pointer"
        }}
    >

        <OverLeafBar setSelectedIcon={setSelectedIcon} />

        {/* HUD UI for Points & Tree Level */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-5 right-5 bg-white p-4 rounded-xl shadow-lg flex space-x-6 items-center border border-gray-300"
        >
          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-sm">Points</span>
            <span className="text-[#1B6630] text-xl font-bold">{user.points_balance}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-gray-500 text-sm">Tree Level</span>
            <span className="text-[#1B6630] text-xl font-bold">{user.tree_level.toFixed(1)}</span>
          </div>
        </motion.div>

        {/* Clickable Plant with Evolution */}
        <motion.div
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 200 }}
         className="relative mt-20" 
          onClick={handleGrow}
          style={cursorStyle}
        >
          <motion.img
            key={getPlantImage()}
            src={getPlantImage()}
            alt="plant"
            className="w-[150px] h-[150px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={cursorStyle}
          />
          {snailExists && (
            <motion.img
              src={snail}
              alt="snail"
              className="absolute top-[-20px] left-[40%] w-[40px] h-[40px] animate-bounce"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </motion.div>
      </div>
    </VFXProvider>
  );
};

export default OverLeaf;
