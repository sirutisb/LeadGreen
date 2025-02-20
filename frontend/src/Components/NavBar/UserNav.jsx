import { useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import { motion } from "framer-motion";

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

  return (
    <motion.button
      onClick={handleAuthAction}
      className={`flex items-center gap-3 px-6 py-3 text-white font-semibold rounded-full shadow-lg transition-all duration-200
        ${user ? "bg-red-600 hover:bg-red-700" : "bg-green-700 hover:bg-green-600"}
      `}
    >
      {/* Icon */}
      <User size={20} />
      {user ? "Logout" : "Login"}
    </motion.button>
  );
}
