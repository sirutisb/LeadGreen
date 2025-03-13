import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Tooltip, Typography } from "@mui/material";

const OverLeafBar = ({ setSelectedIcon, inventory, selectedIcon }) => {
  const scrollContainer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const container = scrollContainer.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (direction) => {
    const container = scrollContainer.current;
    if (!container) return;

    const item = container.querySelector('.inventory-item');
    if (!item) return;

    const itemWidth = item.offsetWidth;
    const gap = 40;
    const scrollAmount = (itemWidth + gap) * direction;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    // Add event listener for scroll
    container.addEventListener('scroll', updateScrollState);
    
    // Initial check for scroll state
    updateScrollState();
    
    // Check after content loads
    window.setTimeout(updateScrollState, 100);

    // Set up observer for content changes
    const observer = new MutationObserver(updateScrollState);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', updateScrollState);
    };
  }, [inventory]);

  // Additional effect to update scroll state on resize
  useEffect(() => {
    const handleResize = () => updateScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AnimatePresence>
      {inventory.length > 0 && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 border border-gray-300 shadow-2xl rounded-full flex items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "min(600px, 90vw)",
            height: "120px",
            padding: "20px 30px"
          }}
        >
          {/* Left Scroll Button */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                onClick={() => scroll(-1)}
                className="absolute left-2 z-10 p-2 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                style={{ 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Right Scroll Button */}
          <AnimatePresence>
            {canScrollRight && (
              <motion.button
                onClick={() => scroll(1)}
                className="absolute right-2 z-10 p-2 rounded-full bg-white border border-gray-200 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
                style={{ 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={scrollContainer}
            className="flex overflow-x-auto flex-nowrap gap-[40px] h-full items-center"
            onScroll={updateScrollState}
            style={{ 
              width: "100%",
              scrollBehavior: 'smooth',
              padding: "0 20px",
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              msOverflowStyle: "none",  /* IE and Edge */
              scrollbarWidth: "none"    /* Firefox */
            }}
          >
            {inventory.map((item) => (
              <motion.div
                key={`${item.id}-${item.amount}`}
                className="relative flex flex-col items-center inventory-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  flexShrink: 0,
                  scrollSnapAlign: "center"
                }}
              >
                <Tooltip title={item.tooltip} arrow>
                  <motion.button
                    className="flex flex-col items-center"
                    whileTap={item.amount > 0 ? { scale: 0.85 } : {}}
                    onClick={() => {
                      if (item.amount > 0) {
                        setSelectedIcon((prev) => (prev === item.id ? null : item.id));
                      }
                    }}
                    style={{
                      opacity: item.amount > 0 ? 1 : 0.4,
                      pointerEvents: item.amount > 0 ? "auto" : "none",
                    }}
                  >
                    <motion.img
                      src={`/assets/${item.id}.svg`}
                      alt={item.label}
                      className="w-12 h-12 aspect-square"
                      animate={{
                        scale: selectedIcon === item.id ? 1.2 : 1,
                        filter: selectedIcon === item.id
                          ? "drop-shadow(0px 0px 12px #1B6630)"
                          : "drop-shadow(0px 0px 0px transparent)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />

                    <Box
                      sx={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        backgroundColor: item.amount > 0 ? "#FF9800" : "#777",
                        color: "white",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        padding: "3px 8px",
                        borderRadius: "999px",
                        boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                      }}
                    >
                      {item.amount}
                    </Box>

                    <Typography variant="body2" sx={{ 
                      color: "#1B6630", 
                      fontWeight: "bold", 
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap"
                    }}>
                      {item.label}
                    </Typography>
                  </motion.button>
                </Tooltip>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverLeafBar;