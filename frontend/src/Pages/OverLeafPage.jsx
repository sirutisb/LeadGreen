import { useEffect } from "react";
import NavBar from "../Components/NavBar/NavBar";
import OverLeaf from "../Components/OverLeaf/OverLeaf";

function OverLeafPage() {
  return (
    <div className="max-h-screen max-w-screen overflow-hidden">
      <div 
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/garden.png')" }}
      ></div>

      <div className="relative">
        <NavBar />
        <OverLeaf />
      </div>
    </div>
  );
}

export default OverLeafPage;
