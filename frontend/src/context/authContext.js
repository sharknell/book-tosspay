import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");

    if (storedToken) {
      setAccessToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/mypage/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
      return response.data; // ✅ 이 줄을 추가!
    } catch (error) {
      console.error("User 정보 로딩 실패:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });

      const { accessToken } = response.data;

      setAccessToken(accessToken);
      sessionStorage.setItem("accessToken", accessToken);

      const userInfo = await fetchUser(accessToken); // ✅ 이 값이 이제 존재함!
      console.log("로그인 성공:", userInfo);
      return userInfo;
    } catch (error) {
      console.error("로그인 실패:", error);
      return null;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    sessionStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
