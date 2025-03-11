// src/context/authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getRefreshToken } from "../utils/authUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });

      setAccessToken(response.data.accessToken);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/refresh", {
        refreshToken,
      });

      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, login, logout, refreshAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
