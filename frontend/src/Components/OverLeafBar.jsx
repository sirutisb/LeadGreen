import React, { useState } from "react";
import fermIcon from "../assets/ferm.svg";
import waterIcon from "../assets/water.svg";
import gloveIcon from "../assets/glove.svg";

const icons = [
  {
    id: "ferm",
    src: fermIcon,
    label: "Ferm",
    tooltip: "Fermentalizer: Helps plant growth x3. Cost: 20 points",
  },
  {
    id: "water",
    src: waterIcon,
    label: "Water",
    tooltip: "Grow plant, increase size. Cost: 10 points",
  },
  {
    id: "glove",
    src: gloveIcon,
    label: "Glove",
    tooltip: "Removes insects. Cost: 50 points",
  },
];

const OverLeafBar = ({ setSelectedIcon }) => {
  const [activeIcon, setActiveIcon] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconClick = (icon) => {
    if (activeIcon === icon) {
      setActiveIcon(null);
      setSelectedIcon(null);
    } else {
      setActiveIcon(icon);
      setSelectedIcon(icon);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#DEFDE9] shadow-lg rounded-full px-6 py-3 flex space-x-6 items-center">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHoveredIcon(icon.id)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Tooltip */}
          {hoveredIcon === icon.id && (
            <div className="absolute bottom-12 bg-black text-white text-xs font-medium p-2 rounded-lg shadow-lg whitespace-nowrap transition-opacity duration-200">
              {icon.tooltip}
            </div>
          )}

          <button
            className={`flex flex-col items-center transition-transform ${
              activeIcon === icon.id ? "scale-125" : "hover:scale-110"
            }`}
            onClick={() => handleIconClick(icon.id)}
          >
            <img
              src={icon.src}
              alt={icon.label}
              className="w-8 h-8"
              style={{
                filter:
                  activeIcon === icon.id
                    ? "drop-shadow(0px 0px 6px #1B6630)"
                    : "none",
              }}
            />
            <span className="text-[#1B6630] text-xs font-semibold">
              {icon.label}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default OverLeafBar;
