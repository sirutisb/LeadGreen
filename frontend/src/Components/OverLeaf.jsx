import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Confetti from "react-confetti";
import { VFXProvider } from "react-vfx";
import useSound from "use-sound";
import mojs from "@mojs/core"; // ✅ Import Mo.js
import OverLeafBar from "./OverLeafBar";
import cursors from "../assets/cursors";

import waterDropSound from "../assets/drop.mp3";
import snailSound from "../assets/snail.mp3";
import alertSound from "../assets/alert.mp3";
import fermSound from "../assets/ferm.mp3";
import gloveSound from "../assets/glove.mp3";
import levelSound from "../assets/level.mp3";
import plant1 from "../assets/plant.svg";
import plant2 from "../assets/plant2.svg";
import plant3 from "../assets/plant3.svg";
import snailImg from "../assets/snail.svg";

const plants = [plant1, plant2, plant3];

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
  const [wiggle, setWiggle] = useState(false);
  const plantRef = useRef(null); // ✅ Reference to the plant image

  // 🎵 Load sounds
  const [playWaterDrop] = useSound(waterDropSound, { volume: 1 });
  const [playFerm] = useSound(fermSound, { volume: 0.7 });
  const [playGlove] = useSound(gloveSound, { volume: 0.6 });
  const [playLevelUp] = useSound(levelSound, { volume: 1.0 });
  const [playSnail] = useSound(snailSound, { volume: 1.0 });
  const [playAlert] = useSound(alertSound, { volume: 0.8 });

  // 🌟 Mo.js burst animation (triggers when plant levels up)
  const burst = useRef(null);

  useEffect(() => {
    burst.current = new mojs.Burst({
      parent: plantRef.current, // Attach animation to the plant
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
    toast.success("🎉 Congratulations! Your plant leveled up!", { theme: "colored" });
    playLevelUp();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
    setScale(1);

    // 🎇 Trigger Mo.js burst animation
    if (burst.current) {
      burst.current.replay();
    }
  };

  const handleSnail = () => {
    setSnailExists(true);
    playSnail();
    toast.warning("🐌 A snail has appeared! Use the glove to remove it.", { theme: "colored" });
  };

  useEffect(() => {
    const newLevelInt = Math.floor(user.tree_level);
    const prevLevelInt = Math.floor(prevLevel);

    if (newLevelInt !== prevLevelInt) {
      handleLevelUp();
    }

    if (newLevelInt % 5 === 0 && newLevelInt !== prevLevelInt) {
      handleSnail();
    }

    setPrevLevel(user.tree_level);
  }, [user.tree_level]);

  // 🏗️ Action handlers
  const handleAction = () => {
    if (!selectedIcon) {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 500);
      return;
    }

    if (snailExists && selectedIcon !== "glove") {
      playAlert();
      toast.error("🐌 A snail is blocking your plant! Use the glove first.", { theme: "colored" });
      return;
    }

    let growth = 0;
    if (selectedIcon === "ferm" && user.points_balance >= 20) {
      user.points_balance -= 20;
      growth = 0.3;
      playFerm();
    } else if (selectedIcon === "water" && user.points_balance >= 10) {
      user.points_balance -= 10;
      growth = 0.1;
      playWaterDrop();
    } else if (selectedIcon === "glove" && snailExists) {
      if (user.points_balance >= 50) {
        user.points_balance -= 50;
        growth = 0.1;
        setSnailExists(false);
        playGlove();
        toast.success("🐌 Snail removed successfully!", { theme: "colored" });
      } else {
        playAlert();
        toast.error("❌ Not enough points to remove the snail!", { theme: "colored" });
      }
    }

    if (growth > 0) {
      user.tree_level += growth;
      setScale((prevScale) => prevScale + growth);
    }
  };

  // 🌟 Cursor Styling
  const cursorStyle = { cursor: selectedIcon ? cursors[selectedIcon] : "pointer" };

  return (
    <VFXProvider>
      {showConfetti && <Confetti numberOfPieces={200} />}
      <div className="flex flex-col items-center justify-center min-h-screen relative" style={cursorStyle}>
        <OverLeafBar setSelectedIcon={setSelectedIcon} />

        {/* 🌱 Plant Container */}
        <motion.div
          ref={plantRef} // ✅ Attach ref here
          animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative mt-20"
          onClick={handleAction}
          style={cursorStyle}
        >
          <motion.img
            src={plants[Math.min(Math.floor(user.tree_level) - 1, plants.length - 1)]}
            alt="plant"
            className="w-[150px] h-[150px]"
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
            style={cursorStyle}
          />

          {/* 🐌 Snail Display */}
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

        {/* 📊 Stats UI */}
        <div className="absolute top-5 right-5 bg-[#DEFDE9] px-4 py-2 rounded-lg shadow-md">
          <p className="text-[#1B6630] font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
          <p className="text-[#1B6630] font-semibold">💰 Points: {user.points_balance}</p>
        </div>
      </div>
    </VFXProvider>
  );
};

export default OverLeaf;
