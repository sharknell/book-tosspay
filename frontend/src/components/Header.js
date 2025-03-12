// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { getRefreshToken } from "../utils/authUtils";
import "./Header.css";

const Header = () => {
  const { accessToken, logout, refreshAccessToken } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await axios.get("http://localhost:5001/api/user", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          if (error.response && error.response.status === 403) {
            // 토큰 만료 시, 토큰 갱신 시도
            refreshAccessToken();
          }
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();
  }, [accessToken, refreshAccessToken]);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    alert("로그아웃 되었습니다.");
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" className="header-title">
          <h1 className="header-title-style">Book Rental</h1>
        </Link>
      </div>
      <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
        <ul>
          <li>
            <Link to="/books" className="link">
              도서 목록
            </Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <span className="welcome">
                  <Link to="/profile" className="link">
                    {currentUser.username}
                  </Link>
                </span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  <li>로그아웃</li>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="link">
                  로그인
                </Link>
              </li>
              <li>
                <Link to="/register" className="link register-btn">
                  회원가입
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
