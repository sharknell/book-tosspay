import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getRefreshToken } from "../utils/authUtils";

const AuthContext = createContext(null); // ✅ 기본값을 null로 설정 (디버깅에 도움)

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("📌 AuthProvider 마운트됨"); // ✅ 디버깅용 로그 추가
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      console.log("📌 저장된 accessToken:", storedToken);
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log("📌 accessToken 변경됨:", accessToken); // ✅ accessToken 변경 감지
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
      console.log("📌 로그인 성공:", response.data);
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  };

  const logout = () => {
    console.log("📌 로그아웃 실행됨");
    setAccessToken(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  const refreshAccessToken = async () => {
    console.log("📌 토큰 갱신 실행");
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
      console.log("📌 새로운 accessToken:", response.data.accessToken);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("📌 useAuth() 호출됨, 반환값:", context); // ✅ 디버깅용 로그 추가
  return context;
};
