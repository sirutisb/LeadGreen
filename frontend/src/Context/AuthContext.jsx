import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const storedTokens = localStorage.getItem("authToken");
  const parsedTokens = storedTokens ? JSON.parse(storedTokens) : null;

  let [authTokens, setAuthTokens] = useState(parsedTokens);
  let [user, setUser] = useState(parsedTokens ? jwt_decode(parsedTokens.access) : null);
  let [loading, setLoading] = useState(true);

  const loginUser = async (e) => {
    let response = await fetch("API_ENDPOINT_HERE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e.email, password: e.password }),
    });

    let data = await response.json(); 

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
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
    navigate("/login");
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser(); // Logout if refresh token is missing
      return;
    }

    let response = await fetch("API_REFRESH_ENDPOINT_HERE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    let data = await response.json(); 

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authToken", JSON.stringify(data));
    } else {
      logoutUser(); // ogout if token refresh fails
    }

    if (loading) {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
        updateToken();
    }
    const fourMins = 1000 * 60 * 4;
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
  };

  return <AuthContext.Provider value={contextData}>{!loading && children}</AuthContext.Provider>;
};
