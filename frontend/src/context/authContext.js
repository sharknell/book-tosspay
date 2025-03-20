import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// AuthContext 생성
const AuthContext = createContext(null);

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null); // user 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // useEffect로 컴포넌트가 렌더링될 때 로그인된 사용자가 있는지 확인
  useEffect(() => {
    const storedToken = sessionStorage.getItem("accessToken");

    if (storedToken) {
      setAccessToken(storedToken);
      fetchUser(storedToken); // 로그인된 경우, user 정보 불러오기
    } else {
      setLoading(false); // 토큰이 없으면 바로 로딩 완료 처리
    }
  }, []);

  // 유저 정보 가져오는 함수
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:5001/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // 서버에서 받은 유저 정보를 상태에 저장
      setLoading(false); // 유저 정보 가져오면 로딩 종료
    } catch (error) {
      console.error("User 정보 로딩 실패:", error);
      setLoading(false); // 실패하더라도 로딩 종료
    }
  };

  // 로그인 함수
  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5001/api/login", {
        email,
        password,
      });
      setAccessToken(response.data.accessToken);
      sessionStorage.setItem("accessToken", response.data.accessToken);
      fetchUser(response.data.accessToken); // 로그인 후 user 정보 가져오기
      return true;
    } catch (error) {
      console.error("로그인 실패:", error);
      return false;
    }
  };

  // 로그아웃 함수
  const logout = () => {
    setAccessToken(null);
    setUser(null); // 로그아웃 시 user 정보 초기화
    sessionStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅으로 AuthContext 사용
export const useAuth = () => {
  return useContext(AuthContext);
};
