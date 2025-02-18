import { useEffect } from "react";
import NavBar from "../Components/NavBar/NavBar";
import OverLeaf from "../Components/OverLeaf";

function OverLeafPage() {
  return (
    <div>
      <div 
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/garden.png')" }}
      ></div>

      <div className="relative mt-20 overflow-hidden">
        <NavBar />
        <OverLeaf />
      </div>
    </div>
  );
}

export default OverLeafPage;
