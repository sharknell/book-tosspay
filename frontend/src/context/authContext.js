import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getRefreshToken } from "../utils/authUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 초기 렌더링 시 accessToken을 sessionStorage에서 불러오기
  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  // accessToken이 바뀔 때마다 sessionStorage에 저장
  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem("accessToken", accessToken);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  // 로그인 처리
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

  // 로그아웃 처리
  const logout = () => {
    setAccessToken(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  // 토큰 갱신 처리
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
      value={{
        accessToken,
        login,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
