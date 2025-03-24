import React from "react";

const StatsDisplay = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="sm:top-5 sm:right-5 bg-[#DEFDE9] px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-md w-fit">
      <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌿 Plant: {user.plant_name}</p>
      <p className="text-[#1B6630] text-sm sm:text-base font-semibold">🌱 Tree Level: {Math.floor(user.tree_level)}</p>
      <p className="text-[#1B6630] text-sm sm:text-base font-semibold">💰 Points: {user.points_balance}</p>
    </div>
  );
};

export default StatsDisplay;