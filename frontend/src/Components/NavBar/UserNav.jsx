import { useContext } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import { motion } from "framer-motion";
import UserPage from "./UserPage";

export default function UserNav() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const handleAuthAction = () => {
    if (user) {
      logoutUser();
    } else {
      navigate("/login");
    }
  };

  

  if (!user) {
    return (
      <motion.button
        onClick={handleAuthAction}
        className="flex items-center gap-3 px-2 py-2 text-white font-semibold rounded-full bg-green-700 hover:bg-green-600 shadow-lg transition-all duration-200 cursor-pointer"
      >
        <User size={20} />
        Login
      </motion.button>
    );
  }

  return (
    <div className="flex items-center gap-3">
  <motion.button
    onClick={handleAuthAction}
    className="flex items-center gap-2 px-3 py-2 text-white font-medium rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 cursor-pointer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <LogOut size={20} />
    Logout
  </motion.button>

  <UserPage />
</div>
  );
}