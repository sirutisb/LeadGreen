import RewardCard from "./RewardCard"
import BonusRewardCard from "./BonusRewardCard"

export default function RewardGrid({ rewards, collectReward, getRewardIcon }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-3 gap-2">
        {/* Row 1: Days 1-3 */}
        {rewards.slice(0, 3).map((reward) => (
          <RewardCard
            key={reward.day}
            reward={reward}
            collectReward={collectReward}
            getRewardIcon={getRewardIcon}
          />
        ))}

        {/* Row 2: Days 4-6 */}
        {rewards.slice(3, 6).map((reward) => (
          <RewardCard
            key={reward.day}
            reward={reward}
            collectReward={collectReward}
            getRewardIcon={getRewardIcon}
          />
        ))}

        {/* Row 3: Day 7 (Bonus Reward) */}
        <BonusRewardCard
          bonusReward={rewards[6]}
          collectReward={collectReward}
          getRewardIcon={getRewardIcon}
        />
      </div>
    </div>
  )
}
