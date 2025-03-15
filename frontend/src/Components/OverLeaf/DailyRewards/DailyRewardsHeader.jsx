export default function DailyRewardsHeader({ streak, renderStreakFlames }) {
    return (
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#008236]">Daily Rewards</h1>
        <p className="text-sm text-[#00A53D] mb-2">Collect rewards every day!</p>
        <div className="flex items-center justify-center gap-1 mt-3 bg-gradient-to-r from-orange-100 to-red-100 p-2 rounded-lg">
          <span className="font-bold text-orange-700 mr-2">Streak: {streak}</span>
          {renderStreakFlames()}
        </div>
      </div>
    )
  }
  