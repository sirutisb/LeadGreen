import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wheel } from "react-custom-roulette";
import { toast } from "react-toastify";
import useSound from "use-sound";
import spinSound from "../../assets/sounds/spin.mp3";
import axiosInstance from "../../Context/axiosInstance";
import { toastSuccess, toastError } from "../utils/toastCustom";

const RouletteButton = ({ user, setUser }) => {
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinData, setSpinData] = useState([]); 
  const spinResultRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [playSpin, { stop: stopSpin }] = useSound(spinSound, { volume: 1 });

  // 🔹 Fetch spin data when component mounts
  useEffect(() => {
    const fetchSpinData = async () => {
      try {
        const response = await axiosInstance.get("/api/game/spin/prizes");
        if (response.data) {
          setSpinData(response.data.prizes);
        }
      } catch (error) {
        toastError("Failed to load spin data!");
      } finally {
        setLoading(false);
      }
    };

    fetchSpinData();
  }, []);

  // 🔹 Handle Spin Click
  const handleSpinClick = async () => {
    if (isSpinning || mustSpin || user.spins <= 0) return;
    setIsSpinning(true);

    try {
      const response = await axiosInstance.post("/api/game/spin/");
      const data = response.data;

      if (data.success) {
        // Use server-provided prize_index if spin is successful
        setPrizeIndex(data.prize_index);
        spinResultRef.current = {
          success: true,
          message: data.message,
          points_balance: data.points_balance,
          spins: data.spins,
        };

        setMustSpin(true);
        playSpin();
      } else {
        // When not successful, don't check for prize_index.
        spinResultRef.current = {
          success: false,
          message: data.message,
          points_balance: data.points_balance,
          spins: data.spins,
        };

        // Update spins and points immediately
        setUser((prev) => ({
          ...prev,
          spins: data.spins,
          points_balance: data.points_balance,
        }));

        toastError(`❌ ${data.message}`);
      }
    } catch (error) {
      toastError("❌ Spin failed! Try again.");
    } finally {
      setIsSpinning(false);
    }
  };

  // 🔹 Handle Spin Stop
  const handleSpinStop = () => {
    stopSpin();
    setMustSpin(false);

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
          user.spins === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-red-500 to-black"
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
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeIndex}
                  data={spinData.map(item => ({
                    ...item,
                    option: item.option,
                    style: item.style,
                  }))}
                  onStopSpinning={handleSpinStop}
                  backgroundColors={["black", "red"]}
                  textColors={["white"]}
                  outerBorderColor="white"
                  spinDuration={0.35}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RouletteButton;
