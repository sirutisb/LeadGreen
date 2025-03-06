import React from "react";
import Confetti from "react-confetti";

const ConfettiEffect = ({ show }) => {
  if (!show) return null;
  return <Confetti numberOfPieces={200} />;
};

export default ConfettiEffect;