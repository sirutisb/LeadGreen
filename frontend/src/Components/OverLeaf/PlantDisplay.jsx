import React from "react";
import { motion } from "framer-motion";
import InsectDisplay from "./InsectDisplay";

const PlantDisplay = ({ plantRef, wiggle, scale, plantImage, plantName, insect, onClick }) => {
  return (
    <motion.div
      ref={plantRef}
      animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative sm:mt-8 md:mt-10 lg:mt-12"
      onClick={onClick}
      style={{ userSelect: "none" }} // Inline CSS to disable selection
    >
      <motion.img 
        src={import.meta.env.VITE_BACKEND + plantImage}
        alt={plantName}
        className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-20"
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
        draggable={false}
      />
      
      <InsectDisplay insect={insect} />
    </motion.div>
  );
};

export default PlantDisplay;