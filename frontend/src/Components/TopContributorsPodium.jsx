import { Trophy } from "lucide-react";

const TopContributorsPodium = ({ topContributors }) => {
  // Check if there are enough contributors to display
  if (!topContributors || topContributors.length < 3) {
    return (
      <div className="py-8 text-center text-gray-500 animate-fade-in">
        Not enough contributors to display.
      </div>
    );
  }

  // Sort contributors by lifetime_points in descending order
  const sortedContributors = [...topContributors].sort(
    (a, b) => b.lifetime_points - a.lifetime_points
  );
  const [first, second, third] = sortedContributors;

  // Calculate podium heights based on points
  const maxPoints = Math.max(
    first.lifetime_points,
    second.lifetime_points,
    third.lifetime_points
  );
  const maxHeight = 12; // Max height in rem for first place
  const getPodiumHeight = (points) => {
    const heightPercentage = (points / maxPoints) * 100;
    const scaledHeight = (heightPercentage / 100) * maxHeight;
    return `${Math.max(scaledHeight, 4)}rem`; // Minimum height of 4rem
  };

  return (
    <div className="podium-container relative animate-fade-in">
      {/* Background floating leaves */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="leaf leaf-1"></div>
        <div className="leaf leaf-2"></div>
        <div className="leaf leaf-3"></div>
      </div>
      <div className="flex justify-center items-end space-x-6">
        {/* Second Place */}
        <div className="flex flex-col items-center">
          <div className="podium-avatar">
            <img
              src={second.user?.profile_picture || "https://via.placeholder.com/150"}
              alt={second.user?.username || "Second Place"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="podium-info text-center mb-2">
            <p className="font-semibold">{second.user?.username || "Unknown"}</p>
            <p className="text-sm text-gray-500">{second.lifetime_points} pts</p>
          </div>
          <div
            className="podium-bar podium-second flex items-center justify-center text-white font-bold"
            style={{ height: getPodiumHeight(second.lifetime_points) }}
          >
            2
          </div>
        </div>

        {/* First Place (Centered) */}
        <div className="flex flex-col items-center">
          <div className="podium-avatar">
            <img
              src={first.user?.profile_picture || "https://via.placeholder.com/150"}
              alt={first.user?.username || "First Place"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="podium-info text-center mb-2">
            <p className="font-semibold">{first.user?.username || "Unknown"}</p>
            <p className="text-sm text-gray-500">{first.lifetime_points} pts</p>
          </div>
          <div
            className="podium-bar podium-first flex items-center justify-center text-white font-bold"
            style={{ height: getPodiumHeight(first.lifetime_points) }}
          >
            <Trophy className="w-8 h-8 text-white animate-pulse-slow" />
            1
          </div>
        </div>

        {/* Third Place */}
        <div className="flex flex-col items-center">
          <div className="podium-avatar">
            <img
              src={third.user?.profile_picture || "https://via.placeholder.com/150"}
              alt={third.user?.username || "Third Place"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="podium-info text-center mb-2">
            <p className="font-semibold">{third.user?.username || "Unknown"}</p>
            <p className="text-sm text-gray-500">{third.lifetime_points} pts</p>
          </div>
          <div
            className="podium-bar podium-third flex items-center justify-center text-white font-bold"
            style={{ height: getPodiumHeight(third.lifetime_points) }}
          >
            3
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopContributorsPodium;