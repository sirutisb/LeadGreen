import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wheel } from "react-custom-roulette";
import { toast } from "react-toastify";

import useSound from "use-sound";
import spinSound from "../../assets/sounds/spin.mp3"; // 🎵 Add spin sound
import { toastSuccess } from "../utils/toastCustom";

const data = [
  { option: "🎁 No Reward", weight: 15, style: { backgroundColor: "red", color: "white" } },
  { option: "🔥 50 Points", weight: 35, style: { backgroundColor: "black", color: "white" } },
  { option: "🌟 100 Points", weight: 30, style: { backgroundColor: "red", color: "white" } },
  { option: "💎 200 Points", weight: 15, style: { backgroundColor: "black", color: "white" } },
  { option: "☘️ 500 Points", weight: 4, style: { backgroundColor: "red", color: "white" } },
  { option: "🏆 1000 Points", weight: 1, style: { backgroundColor: "black", color: "white" } },
];

// 🎯 Function to pick prize based on weighted probability
const getWeightedPrizeIndex = () => {
  const weightedArray = data.flatMap((item, index) => Array(item.weight).fill(index));
  return weightedArray[Math.floor(Math.random() * weightedArray.length)];
};

const RouletteButton = ({ user, setUser }) => {
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  // 🎵 Load roulette spin sound
  const [playSpin, { stop: stopSpin }] = useSound(spinSound, { volume: 1 });

  const handleSpinClick = () => {
    if (!mustSpin && user.spins > 0) {
      setPrizeIndex(getWeightedPrizeIndex());
      setMustSpin(true);
      setUser((prev) => ({
        ...prev,
        spins: prev.spins - 1, // 🔻 Decrease spins count
      }));

      setTimeout(() => {
        playSpin(); // 🔊 Start spin sound
      }, 200);
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    stopSpin(); // 🔇 Stop spin sound when wheel stops

    const reward = data[prizeIndex].option.match(/\d+/) ? parseInt(data[prizeIndex].option.match(/\d+/)[0]) : 0;
    if (reward > 0) {
      setUser((prev) => ({
        ...prev,
        points_balance: prev.points_balance + reward, // ✅ Add points to user
      }));
    }

    toastSuccess(`🎉 You won ${data[prizeIndex].option}!`)

    // ✅ Close popup after a delay
    // setTimeout(() => {
    //   setIsRouletteOpen(false);
    // }, 1500);
  };

  return (
    <>
      {/* 🎰 Button to Open Roulette */}
      <motion.button
        className={`absolute top-32 left-5 ${
          user.spins === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-black"
        } text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-110`}
        onClick={() => user.spins > 0 && setIsRouletteOpen(true)}
        whileTap={{ scale: 0.9 }}
        disabled={user.spins === 0} // ❌ Disable button if no spins left
      >
        🎰 Spins: {user.spins}
      </motion.button>

      {/* 🎡 Roulette Modal */}
<AnimatePresence>
  {isRouletteOpen && (
    <motion.div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(209, 213, 219, 0.7)" }} // ✅ Slightly gray transparent background
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        if (!mustSpin) setIsRouletteOpen(false); // ✅ Prevent closing while spinning
      }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          handleSpinClick();
        }} // ✅ Clicking inside spins the wheel
      >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeIndex}
          data={data}
          onStopSpinning={handleSpinStop} // ✅ Close popup after spin
          backgroundColors={["black", "red"]}
          textColors={["white"]}
          outerBorderColor="white"
          spinDuration={0.35}
        />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
};

export default RouletteButton;
