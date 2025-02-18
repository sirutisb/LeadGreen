import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import soilIcon from "../../assets/soil.svg";
import waterIcon from "../../assets/water.svg";
import gloveIcon from "../../assets/glove.svg";

const icons = [
  {
    id: "soil",
    src: soilIcon,
    label: "soil",
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
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#DEFDE9] shadow-lg rounded-full px-6 py-3 flex space-x-6 items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHoveredIcon(icon.id)}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          {/* Tooltip with Framer Motion */}
          <AnimatePresence>
            {hoveredIcon === icon.id && (
              <motion.div
                className="absolute bottom-12 bg-black text-white text-xs font-medium p-2 rounded-lg shadow-lg whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {icon.tooltip}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button with Animation */}
          <motion.button
            className="flex flex-col items-center"
            whileTap={{ scale: 0.85 }}
            onClick={() => handleIconClick(icon.id)}
          >
            <motion.img
              src={icon.src}
              alt={icon.label}
              className="w-8 h-8"
              animate={{
                scale: activeIcon === icon.id ? 1.2 : 1,
                filter: activeIcon === icon.id ? "drop-shadow(0px 0px 8px #1B6630)" : "drop-shadow(0px 0px 0px transparent)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            <span className="text-[#1B6630] text-xs font-semibold">
              {icon.label}
            </span>
          </motion.button>
        </div>
      ))}
    </motion.div>
  );
};

export default OverLeafBar;
