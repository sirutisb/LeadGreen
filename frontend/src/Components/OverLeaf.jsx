import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { VFXProvider } from "react-vfx";
import plant1 from "../assets/plant.svg";
import plant2 from "../assets/plant2.svg";
import plant3 from "../assets/plant3.svg";
import snailImg from "../assets/snail.svg";
import OverLeafBar from "./OverLeafBar";
import cursors from "../assets/cursors";

const plants = [plant1, plant2, plant3]; // Add more plant images if needed

const user = {
  points_balance: 1000,
  tree_level: 1,
};

const OverLeaf = () => {
  const [scale, setScale] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [snailExists, setSnailExists] = useState(false);
  const [prevLevel, setPrevLevel] = useState(Math.floor(user.tree_level));
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAction = () => {
    if (selectedIcon === "glove") {
      if (snailExists) {
        if (user.points_balance >= 50) {
          user.points_balance -= 50;
          user.tree_level += 0.1;
          setScale(1 + (user.tree_level % 1));
          setSnailExists(false); // ✅ Remove the snail!
          toast.success("🐌 Snail removed successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        } else {
          toast.error("❌ Not enough points to remove the snail!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }
      } else {
        toast.error("❌ No snail to remove!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
      return; // ✅ Exit early if glove is used (don't continue)
    }
  
    if (snailExists) {
      toast.error("🐌 A snail is blocking your plant! Use the glove first.", {
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
  
    if (selectedIcon === "ferm" && user.points_balance >= 20) {
      user.points_balance -= 20;
      user.tree_level += 0.3;
      setScale(1 + (user.tree_level % 1));
    } else if (selectedIcon === "water" && user.points_balance >= 10) {
      user.points_balance -= 10;
      user.tree_level += 0.1;
      setScale(1 + (user.tree_level % 1));
    }
  };
  

  useEffect(() => {
    const newLevelInt = Math.floor(user.tree_level);
    const prevLevelInt = Math.floor(prevLevel);

    if (newLevelInt !== prevLevelInt) {
      toast.success("🎉 Congratulations! Your plant leveled up!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000); // Confetti lasts for 2s
      setScale(1); // Reset size on level up
    }

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

  const cursorStyle = {
    cursor: selectedIcon ? cursors[selectedIcon] : "pointer",
  };

  return (
    <VFXProvider>
      {showConfetti && <Confetti numberOfPieces={200} />}

      <div className="flex flex-col items-center justify-center min-h-screen relative" style={cursorStyle}>
        <OverLeafBar setSelectedIcon={setSelectedIcon} />

        <motion.div
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative mt-20"
          onClick={handleAction}
          style={cursorStyle}
        >
          {/* Plant Selection Based on Level */}
          <motion.img
            src={plants[Math.min(Math.floor(user.tree_level) - 1, plants.length - 1)]}
            alt="plant"
            className="w-[150px] h-[150px]"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={cursorStyle}
          />

          {/* Snail Appears on Level 5, 10, 15... */}
          {snailExists && (
            <motion.img
              src={snailImg}
              alt="snail"
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>

        {/* UI for Points & Level */}
        <div className="absolute top-5 right-5 bg-[#DEFDE9] px-4 py-2 rounded-lg shadow-md">
          <p className="text-[#1B6630] font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
          <p className="text-[#1B6630] font-semibold">💰 Points: {user.points_balance}</p>
        </div>
      </div>
    </VFXProvider>
  );
};

export default OverLeaf;
