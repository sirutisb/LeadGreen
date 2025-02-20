import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { ToastContainer } from "react-toastify";
import Leaderboard from "./Pages/Leaderboard";
import FeedPage from "./Pages/FeedPage";
import OverLeafPage from "./Pages/OverLeafPage";
import RegisterPage from "./Pages/Register";
import LoginPage from "./Pages/LoginPage";
import PrivateRoute from "./Context/PrivateRoute";
import { AuthProvider } from "./Context/AuthContext";
import NavBar from "./Components/NavBar/NavBar";

function App() {

  return (
    <div className="h-screen w-screen ">
        <AuthProvider>
            <Routes>
                {/* Private Routes */}
                <Route
                    path="/game"
                    element={
                    // <PrivateRoute element={OverLeafPage}/>
                    <OverLeafPage /> 
                    }
                />

                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
