import { useState } from "react";
import { User, AlignJustify } from "lucide-react";
import {useNavigate} from "react-router-dom";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Link } from "react-router-dom";

export default function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    //Logout logic 
    localStorage.removeItem("authToken");
    
    // Navigate to the login page after logout
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between border rounded-full bg-green-700 h-14 w-22 transition cursor-pointer hover:bg-green-600">
      <Popup
        trigger={
          <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full flex items-center justify-center gap-2 transition cursor-pointer "
        >
          <AlignJustify />
          <User />
        </button>
        }
        position="bottom right"
        closeOnDocumentClick
        arrow={false}
        contentStyle={{ padding: "0", border: "none" , margin: "4px"}}
      >
        <div className="flex flex-col bg-white rounded-xl shadow-lg">
          <Link
            to="/login"
            className="px-4 py-2 text-green-700 hover:bg-green-100"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-green-700 hover:bg-green-100"
          >
            Register
          </Link>

          <button 
              onClick={handleLogout} 
              className="px-4 py-2 text-red-700 hover:bg-green-100 "
            >
              Log Out
          </button>

        </div>
      </Popup>
    </div>
  );
}


