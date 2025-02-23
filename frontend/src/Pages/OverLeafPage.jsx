import { useEffect } from "react";
import NavBar from "../Components/NavBar/NavBar";
import OverLeaf from "../Components/OverLeaf/OverLeaf";
import Page from "./Page";

function OverLeafPage() {
  return (
    <Page className="max-h-screen max-w-screen overflow-hidden">
      <NavBar />
        <div 
          className="fixed top-0 left-0 w-full h-screen bg-cover bg-center -z-50"
          style={{ backgroundImage: "url('/garden.png')" }}
        ></div>
          <OverLeaf/>
    </Page>
    
  );
}

export default OverLeafPage;
