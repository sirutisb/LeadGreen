import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Retrieve tokens & user from localStorage correctly
  const storedTokens = localStorage.getItem("authTokens");
  const storedUser = localStorage.getItem("user");

  let [authTokens, setAuthTokens] = useState(storedTokens ? JSON.parse(storedTokens) : null);
  let [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  let [loading, setLoading] = useState(false);

  // ✅ Register User
  const registerUser = async (e) => {
    try {
      const { data } = await axiosInstance.post(`/auth/register/`, {
        username: e.username,
        email: e.email,
        password: e.password,
      });

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

  // ✅ Login User
  const loginUser = async (e) => {
    try {
      const { data } = await axiosInstance.post(`/auth/login/`, {
        username: e.username,
        password: e.password,
      });

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

  // ✅ Logout User
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("Token Refresh Error:", error);
      logoutUser();
    }

    setLoading(false);
  };

//   useEffect(() => {
//     if (authTokens) {
//       updateToken();
//     } else {
//       setLoading(false);
//     }

//     const mins = 1000 * 60 * 4;
//     const interval = setInterval(() => {
//       if (authTokens) {
//         updateToken();
//       }
//     }, mins);

//     return () => clearInterval(interval);
//   }, []);

  let contextData = {
    loginUser,
    logoutUser,
    user,
    authTokens,
    registerUser,
  };

  return <AuthContext.Provider value={contextData}>{!loading && children}</AuthContext.Provider>;
};
