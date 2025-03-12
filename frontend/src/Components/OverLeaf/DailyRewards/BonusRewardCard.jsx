import { Check, Lock } from "lucide-react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import React from "react"

export default function BonusRewardCard({ bonusReward, collectReward, getRewardIcon }) {
  return (
    <div className="col-span-3 mt-2">
      <div
        className={`relative flex items-center rounded-xl p-3 shadow-md transition-all ${
          bonusReward.isCollected
            ? "bg-gray-100 border-2 border-green-200"
            : "bg-gradient-to-r from-[#008236] to-[#00A53D]"
        } ${
          !bonusReward.canCollect && !bonusReward.isCollected
            ? "bg-gradient-to-r from-gray-600 to-gray-700 grayscale-[30%]"
            : ""
        }`}
      >
        {/* Day Label */}
        <div
          className={`flex items-center justify-center rounded-full border-2 font-bold px-3 py-1 ${
            bonusReward.isCollected
              ? "border-green-300 bg-green-50 text-green-600"
              : !bonusReward.canCollect
              ? "border-gray-400 bg-gray-800/50 text-gray-300"
              : "border-white bg-white/20 text-white"
          }`}
        >
          Day 7
        </div>

        <div className="ml-3 flex items-center">
          <div className="relative flex items-center">
            {/* Render larger icon without the circular container */}
            <Box
              sx={{
                mr: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {React.cloneElement(getRewardIcon(bonusReward.reward), { className: "w-8 h-8" })}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {bonusReward.amount}
            </Typography>
            {!bonusReward.canCollect && !bonusReward.isCollected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded border-2 border-gray-600"></div>
                <Lock className="h-5 w-5 text-white z-10" />
              </div>
            )}
          </div>

          <div className="flex-1 ml-3">
            <p
              className={`text-sm ${
                bonusReward.isCollected
                  ? "text-green-600"
                  : !bonusReward.canCollect
                  ? "text-gray-400"
                  : "text-white/80"
              }`}
            >
              BONUS REWARD
            </p>
          </div>

          <button
            onClick={() => collectReward(bonusReward.day)}
            disabled={bonusReward.isCollected || !bonusReward.canCollect}
            className={`rounded-lg px-2 py-0.5 ml-4 font-medium transition-all ${
              bonusReward.isCollected
                ? "cursor-default bg-green-200 text-green-700"
                : !bonusReward.canCollect
                ? "cursor-not-allowed bg-gray-700 text-gray-400"
                : "bg-white text-[#008236] hover:bg-white/90"
            }`}
          >
            {bonusReward.isCollected ? "Collected" : !bonusReward.canCollect ? "Locked" : "Collect"}
          </button>
        </div>

        <div className="absolute -right-6 -top-2 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-white z-30">
          BONUS
        </div>

        {(!bonusReward.canCollect && !bonusReward.isCollected) && (
          <div className="absolute inset-0 rounded-xl border-2 border-gray-600 pointer-events-none"></div>
        )}
      </div>
    </div>
  )
}
