import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // CSS 파일 적용

const Header = ({ user, handleLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Book Rental</Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/books">도서 목록</Link>
          </li>
          {user ? (
            <>
              <li>
                <span className="welcome">
                  {user.username || user.email.split("@")[0]} 님
                </span>
              </li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/register" className="register-btn">
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
