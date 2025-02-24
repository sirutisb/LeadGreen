import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();


  // Retrieve stored auth tokens and user data from localStorage
  const storedTokens = localStorage.getItem("authTokens");
  const storedUser = localStorage.getItem("user");

  let [authTokens, setAuthTokens] = useState(storedTokens ? JSON.parse(storedTokens) : null);
  let [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  let [loading, setLoading] = useState(false);


  const registerUser = async (e) => {
    try {
      const { data } = await axiosInstance.post(`/auth/register/`, {
        username: e.username,
        email: e.email,
        password: e.password,
      });
// Store tokens and user data in state and localStorage
      setAuthTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("authTokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      alert("ERROR");
    }
  };


  const loginUser = async (e) => {
    try {
      const { data } = await axiosInstance.post(`/auth/login/`, {
        username: e.username,
        password: e.password,
      });
      // Store tokens and user data in state and localStorage
      setAuthTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("authTokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      alert("ERROR");
    }
  };

// User logout function
  const logoutUser = () => {

    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    navigate("/login");
  };
// Function to refresh authentication tokens
  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      });
// Update tokens in state and localStorage
      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("Token Refresh Error:", error);
      logoutUser();
    }

    setLoading(false);
  };

  let contextData = {
    loginUser,
    logoutUser,
    user,
    authTokens,
    registerUser,
  };

  return <AuthContext.Provider value={contextData}>{!loading && children}</AuthContext.Provider>;
};
