import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const storedTokens = localStorage.getItem("authToken");
  const parsedTokens = storedTokens ? JSON.parse(storedTokens) : null;

  let [authTokens, setAuthTokens] = useState(parsedTokens);
  let [user, setUser] = useState(parsedTokens ? jwtDecode(parsedTokens.access) : null);
  let [loading, setLoading] = useState(false); // set to true

  const registerUser = async (e) => {
    let response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username: e.username, email: e.email, password: e.password }),
      });
      let data = await response.json(); 
      console.log(data)
      if (response.status == 201) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authToken", JSON.stringify(data)); 
        navigate("/");
      } else {
        alert("ERROR");
      }
  }
  const loginUser = async (e) => {
    let response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: e.username, password: e.password }),
    });

    let data = await response.json(); 
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", JSON.stringify(data)); 
      navigate("/");
    } else {
      alert("ERROR");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authToken");
    // navigate("/login");
  };

  const updateToken = async () => {
    console.log(first)
    if (!authTokens?.refresh) {
      logoutUser(); // Logout if refresh token is missing
      return;
    }

    let response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json(); 
    console.log(data)
    if (response.status === 200) {
        console.log("refresh data", data)
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authToken", JSON.stringify(data));
    } else {
      logoutUser(); 
    }

    if (loading) {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
        updateToken();
    }
    const fourMins = 1000;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMins);

    return () => clearInterval(interval);
  }, [authTokens]);

  let contextData = {
    loginUser,
    logoutUser,
    user,
    authTokens,
    registerUser
  };

  return <AuthContext.Provider value={contextData}>{!loading && children}</AuthContext.Provider>;
};
