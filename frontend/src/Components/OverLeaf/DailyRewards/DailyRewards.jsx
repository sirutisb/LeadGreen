import { useState, useEffect } from "react";
import DailyRewardsModal from "./DailyRewardsModal";
import { motion } from "framer-motion";
import axiosInstance from "../../../Context/axiosInstance"
// Import custom icons from assets
import waterIcon from "../../../assets/water.svg";
import soilIcon from "../../../assets/soil.svg";
import gloveIcon from "../../../assets/glove.svg";
import pestIcon from "../../../assets/pest.svg";
import spinIcon from "../../../assets/spin.svg";

// Use Flame from lucide-react for the streak indicator
import { Flame } from "lucide-react";

export default function DailyRewards({setUser, setInventory}) {
  const [open, setOpen] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [streak, setStreak] = useState(0);

  // Function to fetch rewards data from the API
  const fetchRewards = () => {
    axiosInstance.get("/game/reward")
      .then((response) => response.data)
      .then((data) => {
        console.log(data)
        setStreak(data[0].streak); // First element contains the streak
        setRewards(data.slice(1)); // Remaining elements are the rewards
      })
      .catch((error) => console.error("Error fetching rewards:", error));
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchRewards();
  }, []);

  const collectReward = () => {
    // Find the reward that can be collected
    const rewardToCollect = rewards.find((reward) => reward.canCollect);
  
    // Check if there’s a collectible reward
    if (rewardToCollect) {
      // Update the rewards state optimistically
      setRewards(
        rewards.map((reward) => {
          if (reward.day === rewardToCollect.day) {
            return { ...reward, isCollected: true, canCollect: false };
          }
          return reward;
        })
      );
  
      // Update the streak if it’s less than the maximum (e.g., 7 days)
      if (streak < 7) {
        setStreak(streak + 1);
      }
  
      // Update user state based on reward type
      if (rewardToCollect.reward === "spin") {
        // Update spins in the user state
        setUser((prevUser) => ({
          ...prevUser,
          spins: (prevUser.spins || 0) + rewardToCollect.amount,
        }));
      } else {
            setInventory((prevInventory) =>
                prevInventory.map((item) => {
                if (item.label.toLowerCase() === rewardToCollect.reward.toLowerCase()) {
                    return { ...item, amount: item.amount + rewardToCollect.amount };
                }
                return item;
                })
            );
      }
  
      // Send the POST request to the server (optimistic update, no rollback here)
      axiosInstance.post("/game/reward/").catch((error) => {
        console.error("Error collecting reward:", error);
        // Optionally, notify the user of the failure
      });
    }
  };

  const getRewardIcon = (rewardName) => {
    switch (rewardName) {
      case "water":
        return <img src={waterIcon} alt="water" className="w-5 h-5" />;
      case "spin":
        return <img src={spinIcon} alt="spin" className="w-5 h-5" />;
      case "soil":
        return <img src={soilIcon} alt="soil" className="w-5 h-5" />;
      case "glove":
        return <img src={gloveIcon} alt="glove" className="w-5 h-5" />;
      case "pest":
        return <img src={pestIcon} alt="pest" className="w-5 h-5" />;
      default:
        return <img src={gloveIcon} alt="default" className="w-5 h-5" />;
    }
  };

  const renderStreakFlames = () => {
    const flames = [];
    for (let i = 0; i < streak; i++) {
      flames.push(
        <Flame
          key={i}
          className={`h-6 w-6 ${i % 2 === 0 ? "text-orange-500" : "text-red-500"}`}
          fill="currentColor"
        />
      );
    }
    return flames;
  };

  return (
    <>
      <motion.button
        className="bg-gradient-to-r from-green-500 to-black text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-110"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
      >
        🎁 Rewards
      </motion.button>

      <DailyRewardsModal
        open={open}
        onClose={() => setOpen(false)}
        rewards={rewards}
        collectReward={collectReward}
        streak={streak}
        getRewardIcon={getRewardIcon}
        renderStreakFlames={renderStreakFlames}
      />
    </>
  );
}