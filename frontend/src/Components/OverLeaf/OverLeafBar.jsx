import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import soilIcon from "../../assets/soil.svg";
import waterIcon from "../../assets/water.svg";
import gloveIcon from "../../assets/glove.svg";

const icons = [
  {
    id: "soil",
    src: soilIcon,
    label: "Soil",
    tooltip: "Helps plant growth x3. Cost: 20 points",
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
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#DEFDE9] shadow-2xl rounded-full flex items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        display: "inline-flex", 
        maxWidth: "90vw", 
        height: "clamp(80px, 12vw, 100px)", // ✅ Taller for spacing
        whiteSpace: "nowrap", 
        padding: window.innerWidth < 640? "50px 20px":"50px 30px",
        gap: "40px", // ✅ Spacing between icons
      }}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHoveredIcon(icon.id)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* 🔥 Tooltip - Now Higher Up */}
          <AnimatePresence>
            {hoveredIcon === icon.id && (
              <motion.div
                className="absolute mb-8 bottom-20 bg-black text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {icon.tooltip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Button with Proper Spacing */}
          <motion.button
            className="flex flex-col items-center"
            whileTap={{ scale: 0.85 }}
            onClick={() => handleIconClick(icon.id)}
          >
            <motion.img
  src={icon.src}
  alt={icon.label}
  className="w-[12vw] h-[12vw] max-w-[60px] max-h-[60px] min-w-[40px] min-h-[40px] sm:w-14 sm:h-14 md:w-12 md:h-12 lg:w-10 lg:h-10 aspect-square" 
  animate={{
    scale: activeIcon === icon.id ? 1.2 : 1,
    filter: activeIcon === icon.id
      ? "drop-shadow(0px 0px 12px #1B6630)"
      : "drop-shadow(0px 0px 0px transparent)",
  }}
  transition={{ type: "spring", stiffness: 300, damping: 15 }}
/>

            <span className="text-[#1B6630] text-sm font-semibold  sm:text-base">
              {icon.label}
            </span>
          </motion.button>
        </div>
      ))}
    </motion.div>
  );
};

export default OverLeafBar;
