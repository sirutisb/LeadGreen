import RewardCardCollected from "./RewardCardCollected"
import RewardCardLocked from "./RewardCardLocked"
import RewardCardNormal from "./RewardCardNormal"

export default function RewardCard({ reward, collectReward, getRewardIcon }) {
  if (reward.isCollected) {
    return (
      <RewardCardCollected
        reward={reward}
        getRewardIcon={getRewardIcon}
      />
    )
  } else if (!reward.canCollect) {
    return (
      <RewardCardLocked
        reward={reward}
        getRewardIcon={getRewardIcon}
      />
    )
  } else {
    return (
      <RewardCardNormal
        reward={reward}
        collectReward={collectReward}
        getRewardIcon={getRewardIcon}
      />
    )
  }
}
