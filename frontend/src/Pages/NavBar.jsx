import React from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

function NavBar() {
  return (
    <header className="w-full bg-[#DEFDE9] shadow-md z-50 fixed top-0 left-0">
  <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
    {/* Logo */}
    <Link to="/" className="flex items-center space-x-2">
      <Leaf className="h-8 w-8 text-[#1B6630]" />
      <span className="text-2xl font-bold text-[#1B6630] tracking-wide">
        LeadGreen
      </span>
    </Link>

    {/* Navigation Links */}
    <div className="flex space-x-6">
      <Link to="/feed" className="text-[#1B6630] font-medium hover:text-[#0F4420] transition duration-200">
        Feed
      </Link>
      <Link to="/leaderboard" className="text-[#1B6630] font-medium hover:text-[#0F4420] transition duration-200">
        Leaderboard
      </Link>
      <Link to="/game" className="text-[#1B6630] font-medium hover:text-[#0F4420] transition duration-200">
        OverLeaf ☘️
      </Link>
    </div>
  </nav>
</header>
  );
}

export default NavBar;
