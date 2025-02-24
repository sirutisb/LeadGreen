import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const baseURL = import.meta.env.BACKEND+"/api/";

let authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
  },
});

axiosInstance.interceptors.request.use(async (req) => {
  authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;

  if (!authTokens) return req;

  const user = jwtDecode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

  if (!isExpired) {
    req.headers.Authorization = `Bearer ${authTokens.access}`;
    return req;
  }

  try {
    const response = await axios.post(`${baseURL}auth/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("authTokens", JSON.stringify(response.data));
    req.headers.Authorization = `Bearer ${response.data.access}`;
  } catch (error) {
    console.error("Token Refresh Failed:", error);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    
  }

  return req;
});

export default axiosInstance;
