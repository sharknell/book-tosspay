import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { getRefreshToken } from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // user 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");
    if (storedToken) {
      setAccessToken(storedToken);
      // 여기에 추가적으로 사용자 정보도 가져오는 로직을 넣어야 합니다
      fetchUserData(storedToken); // 사용자 정보를 가져오는 함수 호출
    }
    setLoading(false);
  }, []);

  // accessToken이 있을 경우 user 정보를 서버에서 가져오는 함수
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("http://localhost:5001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user); // 서버에서 받은 사용자 정보를 상태에 저장
    } catch (error) {
      console.error("사용자 정보 로딩 실패:", error);
      setUser(null);
    }
  };

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

      // 로그인 성공 시 서버에서 사용자 정보 가져오기
      setUser(response.data.user); // 로그인 시 받은 user 정보 상태에 저장

      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null); // 로그아웃 시 user 정보 초기화
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user, // user 정보 제공
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
