import { useState } from "react"
import DailyRewardsModal from "./DailyRewardsModal"
import { motion } from "framer-motion"

// Import your custom icons from assets
import waterIcon from "../../../assets/water.svg"
import soilIcon from "../../../assets/soil.svg"
import gloveIcon from "../../../assets/glove.svg"
import pestIcon from "../../../assets/pest.svg"
import spinIcon from "../../../assets/spin.svg"

// We'll still use Flame from lucide-react for the streak indicator
import { Flame } from "lucide-react"

export default function DailyRewards() {
  const [open, setOpen] = useState(false)
  const [rewards, setRewards] = useState([
    { day: 1, reward: "water", amount: "x5", isCollected: true, canCollect: false },
    { day: 2, reward: "spin", amount: "x2", isCollected: false, canCollect: true },
    { day: 3, reward: "soil", amount: "x3", isCollected: false, canCollect: false },
    { day: 4, reward: "spin", amount: "x4", isCollected: false, canCollect: false },
    { day: 5, reward: "glove", amount: "x2", isCollected: false, canCollect: false },
    { day: 6, reward: "spin", amount: "x6", isCollected: false, canCollect: false },
    { day: 7, reward: "pest", amount: "x2", isCollected: false, canCollect: false },
  ])
  const [streak, setStreak] = useState(3)

  const collectReward = (day) => {
    setRewards(
      rewards.map((reward) => {
        if (reward.day === day && reward.canCollect) {
          return { ...reward, isCollected: true }
        }
        return reward
      })
    )
    if (streak < 7) {
      setStreak(streak + 1)
    }
  }

  const getRewardIcon = (rewardName) => {
    switch (rewardName) {
      case "water":
        return <img src={waterIcon} alt="water" className="w-5 h-5" />
      case "spin":
        return <img src={spinIcon} alt="spin" className="w-5 h-5" />
      case "soil":
        return <img src={soilIcon} alt="soil" className="w-5 h-5" />
      case "glove":
        return <img src={gloveIcon} alt="glove" className="w-5 h-5" />
      case "pest":
        return <img src={pestIcon} alt="pest" className="w-5 h-5" />
      default:
        return <img src={gloveIcon} alt="default" className="w-5 h-5" />
    }
  }

  const renderStreakFlames = () => {
    const flames = []
    for (let i = 0; i < streak; i++) {
      flames.push(
        <Flame
          key={i}
          className={`h-6 w-6 ${i % 2 === 0 ? "text-orange-500" : "text-red-500"}`}
          fill="currentColor"
        />
      )
    }
    return flames
  }

  return (
    <>
      <motion.button
        className="absolute top-45 left-5 bg-gradient-to-r from-green-500 to-black text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all hover:scale-110"
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.9 }}
      >
        🎁 Rewards
      </motion.button>

      <DailyRewardsModal
        open={open}
        onClose={() => setOpen(false)}
        rewards={rewards}
        onCollect={collectReward}
        streak={streak}
        getRewardIcon={getRewardIcon}
        renderStreakFlames={renderStreakFlames}
      />
    </>
  )
}
