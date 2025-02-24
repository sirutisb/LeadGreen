import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wheel } from "react-custom-roulette";
import { toast } from "react-toastify";
import useSound from "use-sound";
import spinSound from "../../assets/sounds/spin.mp3";
import axiosInstance from "../../Context/axiosInstance";
import { toastSuccess, toastError } from "../utils/toastCustom";

const data = [
  { option: "🎁 No Reward", weight: 15, style: { backgroundColor: "red", color: "white" } },
  { option: "🔥 50 Points", weight: 35, style: { backgroundColor: "black", color: "white" } },
  { option: "🌟 100 Points", weight: 30, style: { backgroundColor: "red", color: "white" } },
  { option: "💎 200 Points", weight: 15, style: { backgroundColor: "black", color: "white" } },
  { option: "☘️ 500 Points", weight: 4, style: { backgroundColor: "red", color: "white" } },
  { option: "🏆 1000 Points", weight: 1, style: { backgroundColor: "black", color: "white" } },
];
// Determines prize index based on weight distribution
const getWeightedPrizeIndex = () => {
  const weightedArray = data.flatMap((item, index) => Array(item.weight).fill(index));
  return weightedArray[Math.floor(Math.random() * weightedArray.length)];
};

const RouletteButton = ({ user, setUser }) => {
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinResultRef = useRef(null); 

  const [playSpin, { stop: stopSpin }] = useSound(spinSound, { volume: 1 });

  const handleSpinClick = async () => {
    if (isSpinning || mustSpin || user.spins <= 0) return;
    setIsSpinning(true);

    const selectedPrizeIndex = getWeightedPrizeIndex();
    setPrizeIndex(selectedPrizeIndex);

    const reward = parseInt(data[selectedPrizeIndex].option.match(/\d+/)?.[0]) || 0;

    setUser((prev) => ({
      ...prev,
      spins: prev.spins - 1, // Deduct spin immediately for UI sync
    }));

    try {
      const response = await axiosInstance.post("/game/spin/", { points: reward });
      const data = response.data;

      if (data.success) {
        // Store result to update UI after spin stops
        spinResultRef.current = {
          success: true,
          message: data.message,
          points_balance: data.points_balance,
          spins: data.spins,
        };

        setMustSpin(true); 
        playSpin();
      } else {
        toastError("❌ Spin failed! Try again.");
        setUser((prev) => ({ ...prev, spins: prev.spins + 1 })); // Rollback spin count
      }
    } catch (error) {
      toastError("❌ Network error! Try again.");
      setUser((prev) => ({ ...prev, spins: prev.spins + 1 })); // Rollback spin count
    } finally {
      setIsSpinning(false);
    }
  };

  const handleSpinStop = () => {
    stopSpin();
    setMustSpin(false);
// Update user state with new points and spins after spin completes
    if (spinResultRef.current?.success) {
      setUser((prev) => ({
        ...prev,
        spins: spinResultRef.current.spins,
        points_balance: spinResultRef.current.points_balance,
      }));

      toastSuccess(`🎉 ${spinResultRef.current.message}`);
    }
  };

  return (
    <>
      <motion.button
        className={`absolute top-32 left-5 ${
          user.spins === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-black"
        } text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-110`}
        onClick={() => user.spins > 0 && setIsRouletteOpen(true)}
        whileTap={{ scale: 0.9 }}
        disabled={user.spins === 0 || isSpinning}
      >
        🎰 Spins: {user.spins}
      </motion.button>

      {/* 🎡 Roulette Modal */}
      <AnimatePresence>
        {isRouletteOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: "rgba(209, 213, 219, 0.7)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!mustSpin) setIsRouletteOpen(false);
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
              }}
            >
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeIndex}
                data={data}
                onStopSpinning={handleSpinStop}
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
