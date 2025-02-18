import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';

const TreeSVG = ({ scale = 1, color }) => (
  <svg 
    viewBox="0 0 100 120" 
    width={100 * scale} 
    height={120 * scale}
    className="transition-all duration-1000"
  >
    {/* Trunk */}
    <path
      d="M45 120 L45 50 C45 40 55 40 55 50 L55 120"
      fill="#8B4513"
    />
    {/* Tree layers */}
    <path
      d="M20 80 C20 60 80 60 80 80 C80 100 20 100 20 80"
      fill={color}
      className="transition-colors duration-1000"
    />
    <path
      d="M15 60 C15 40 85 40 85 60 C85 80 15 80 15 60"
      fill={color}
      className="transition-colors duration-1000"
    />
    <path
      d="M25 40 C25 20 75 20 75 40 C75 60 25 60 25 40"
      fill={color}
      className="transition-colors duration-1000"
    />
    <path
      d="M35 20 C35 0 65 0 65 20 C65 40 35 40 35 20"
      fill={color}
      className="transition-colors duration-1000"
    />
  </svg>
);

const GrowingTree = () => {
  const [xp, setXp] = useState(0);
  const [treeStage, setTreeStage] = useState(0);
  const [isWatering, setIsWatering] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const stages = [
    { threshold: 0, scale: 0.8, color: '#2F855A' },
    { threshold: 50, scale: 1, color: '#276749' },
    { threshold: 100, scale: 1.2, color: '#22543D' },
    { threshold: 200, scale: 1.4, color: '#1C4532' }
  ];

  useEffect(() => {
    const newStage = stages.reduce((acc, stage, index) => {
      if (xp >= stage.threshold) return index;
      return acc;
    }, 0);
    
    if (newStage > treeStage) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1500);
    }
    
    setTreeStage(newStage);
  }, [xp]);

  const handleWater = () => {
    if (isWatering) return;
    
    setIsWatering(true);
    setXp(prev => Math.min(prev + 10, 200));
    
    setTimeout(() => {
      setIsWatering(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-50 to-green-50 rounded-lg max-w-md mx-auto shadow-lg">
      <div className="relative mb-8 h-96">
        {/* Water droplets animation */}
        <div 
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
            isWatering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="animate-bounce"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              >
                <Droplets size={24} className="text-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Level up animation */}
        {showLevelUp && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-yellow-500 animate-bounce">
            Level Up!
          </div>
        )}
        
        {/* Tree */}
        <div className="mt-12 transition-transform duration-1000 ease-out transform origin-bottom" style={{
          transform: `scale(${stages[treeStage].scale})`
        }}>
          <TreeSVG scale={1} color={stages[treeStage].color} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
        <div 
          className="bg-green-500 rounded-full h-4 transition-all duration-500 ease-out"
          style={{ width: `${(xp / 200) * 100}%` }}
        />
      </div>

      {/* XP Counter */}
      <div className="text-lg font-semibold mb-4 text-gray-700">
        {xp} / 200 XP
      </div>

      {/* Water button */}
      <button
        onClick={handleWater}
        disabled={isWatering || xp >= 200}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold
          transform transition-all duration-200 hover:scale-105
          ${isWatering || xp >= 200 ? 
            'bg-gray-400' : 
            'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'
          }
        `}
      >
        <Droplets size={20} />
        Water Tree
      </button>
    </div>
  );
};

export default GrowingTree;