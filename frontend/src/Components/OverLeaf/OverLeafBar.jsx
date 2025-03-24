import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OverLeafBar = ({ setSelectedIcon, inventory, selectedIcon }) => {
  const scrollContainer = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [barWidth, setBarWidth] = useState("min(700px, 90vw)"); // Initial width

  // Update scroll button visibility
  const updateScrollState = () => {
    const container = scrollContainer.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  // Scroll function
  const scroll = (direction) => {
    const container = scrollContainer.current;
    if (!container) return;
    const item = container.querySelector(".inventory-item");
    if (!item) return;
    const itemWidth = item.offsetWidth;
    const gap = 40;
    const visibleItems = Math.floor(container.clientWidth / (itemWidth + gap));
    const scrollAmount = (itemWidth + gap) * direction * Math.max(1, Math.floor(visibleItems / 2));
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Calculate bar width based on inventory length
  useEffect(() => {
    const calculateBarWidth = () => {
      const container = scrollContainer.current;
      if (!container) return;
      const item = container.querySelector(".inventory-item");
      if (!item) return;
      const itemWidth = item.offsetWidth;
      if (itemWidth === 0) {
        // Retry if items aren't fully rendered
        setTimeout(calculateBarWidth, 100);
        return;
      }
      const gap = 40; // Gap between items
      const outerPadding = 60; // Outer div padding (30px left + 30px right)
      const innerPadding = 40; // Scroll container padding (20px left + 20px right)
      const N = Math.min(3, inventory.length); // Number of items to display (max 3)
      const contentWidth = N * itemWidth + (N - 1) * gap; // Width for N items + gaps
      const totalWidth = contentWidth + innerPadding + outerPadding; // Total width including all padding
      setBarWidth(`${totalWidth}px`);
    };

    calculateBarWidth();
    window.addEventListener("resize", calculateBarWidth);
    return () => window.removeEventListener("resize", calculateBarWidth);
  }, [inventory]);

  // Scroll state and observer setup (unchanged)
  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState();
    window.setTimeout(updateScrollState, 100);
    const observer = new MutationObserver(updateScrollState);
    observer.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", updateScrollState);
    };
  }, [inventory]);

  useEffect(() => {
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation variants (unchanged)
  const barVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    hover: { scale: 1.1, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" },
    tap: { scale: 0.9 },
  };

  return (
    <AnimatePresence>
      {inventory.length > 0 && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full flex items-center"
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            width: barWidth, // Dynamic width
            height: "120px",
            padding: "20px 30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15), 0 3px 8px rgba(0,0,0,0.1)",
            zIndex: 50,
          }}
        >
          {/* Left Scroll Button */}
          <AnimatePresence>
            {canScrollLeft && (
              <motion.button
                onClick={() => scroll(-1)}
                className="absolute left-2 z-10 p-2 rounded-full bg-white border border-gray-100 shadow-lg hover:bg-gray-50 transition-all"
                style={{ top: "calc(50% + -18px)", transform: "translateY(-50%)", height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                whileTap="tap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="absolute right-2 z-10 p-2 rounded-full bg-white border border-gray-100 shadow-lg hover:bg-gray-50 transition-all"
                style={{ top: "calc(50% + -18px)", transform: "translateY(-50%)", height: "40px", width: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover="hover"
                whileTap="tap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={scrollContainer}
            className="flex overflow-x-auto flex-nowrap gap-[40px] h-full items-center scrollbar-hide"
            onScroll={updateScrollState}
            style={{
              width: "100%",
              scrollBehavior: "smooth",
              padding: "0 20px",
              justifyContent: inventory.length <= 3 ? "center" : "flex-start", // Center items if 3 or fewer
              maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {inventory.map((item) => (
              <motion.div
                key={`${item.id}-${item.amount}`}
                className="relative flex flex-col items-center inventory-item"
                variants={itemVariants}
                style={{ flexShrink: 0, scrollSnapAlign: "center" }}
                onHoverStart={() => setHoveredItem(item.id)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <motion.div
                  className="tooltip"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: hoveredItem === item.id ? 1 : 0, y: hoveredItem === item.id ? -5 : 10, scale: hoveredItem === item.id ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "-40px",
                    backgroundColor: "rgba(0,0,0,0.75)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 60,
                  }}
                >
                  {item.tooltip}
                </motion.div>
                <motion.div drag={item.amount > 0} dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragElastic={0.1} onDragStart={() => setIsDragging(true)} onDragEnd={() => setIsDragging(false)}></motion.div>
                <motion.button
                  className="flex flex-col items-center"
                  whileTap={item.amount > 0 ? { scale: 0.85 } : {}}
                  onClick={() => {
                    if (item.amount > 0) {
                      setSelectedIcon((prev) => (prev === item.id ? null : item.id));
                    }
                  }}
                  style={{ opacity: item.amount > 0 ? 1 : 0.4, pointerEvents: item.amount > 0 ? "auto" : "none" }}
                >
                  <motion.div
                    className="relative"
                    animate={{ scale: selectedIcon === item.id ? 1.15 : hoveredItem === item.id ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <motion.img
                      src={item.image || `/assets/items/${item.id}.svg`}
                      alt={item.label}
                      className="w-12 h-12 aspect-square object-cover rounded-lg"
                      animate={{
                        filter: selectedIcon === item.id ? "drop-shadow(0px 0px 12px rgba(27, 102, 48, 0.7))" : hoveredItem === item.id ? "drop-shadow(0px 0px 5px rgba(27, 102, 48, 0.3))" : "drop-shadow(0px 0px 0px transparent)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    />
                    {selectedIcon === item.id && (
                      <motion.div
                        className="absolute -inset-3 rounded-full z-0"
                        style={{ background: "radial-gradient(circle, rgba(0, 231, 66, 0.12) 0%, rgba(0, 255, 72, 0) 70%)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full font-bold text-xs text-white"
                    style={{ backgroundColor: item.amount > 0 ? "#FF9800" : "#777", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }}
                    animate={{ scale: hoveredItem === item.id || selectedIcon === item.id ? 1.1 : 1 }}
                  >
                    {item.amount}
                  </motion.div>
                  <motion.div className="mt-1 font-semibold text-xs text-emerald-800" animate={{ scale: selectedIcon === item.id ? 1.05 : 1, fontWeight: selectedIcon === item.id ? "700" : "600" }}>
                    {item.label}
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverLeafBar;