import React from 'react';
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const navigate = useNavigate();

  const navigateToProfile = () => {
    navigate("/profile");
  };

  return (
    <motion.button
  onClick={navigateToProfile}
  className="flex items-center gap-2 px-3 py-2 text-white font-medium rounded-full bg-green-600 hover:bg-green-700 transition-all duration-200 cursor-pointer"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  <UserCircle size={20} />
</motion.button>
  );
}

export default UserPage;
