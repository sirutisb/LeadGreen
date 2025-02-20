import { useContext } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

export default function UserNav() {
  const navigate = useNavigate();
  const { user, logoutUser } = useContext(AuthContext);

  const handleAuthAction = () => {
    if (user) {
      logoutUser(); // If logged in, log out
    } else {
      navigate("/login"); // If not logged in, navigate to login
    }
  };

  return (
    <button
      onClick={handleAuthAction}
      className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full transition"
    >
      <User />
      {user ? "Logout" : "Login"}
    </button>
  );
}
