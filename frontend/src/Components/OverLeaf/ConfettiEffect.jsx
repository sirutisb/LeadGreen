import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

const ConfettiEffect = ({ show }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!show) return null;

  return (
    <Confetti
      numberOfPieces={200}
      width={windowSize.width}
      height={windowSize.height}
      style={{ position: "fixed", top: 0, left: 0 }}
    />
  );
};

export default ConfettiEffect;