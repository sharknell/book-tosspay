// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import BookList from "./pages/BookList";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(null); // 로그인 상태 관리

  const handleLogout = () => {
    setUser(null);
    alert("로그아웃되었습니다.");
  };

  return (
    <Router>
      <div className="App">
        <h1>도서 대여 시스템</h1>

        {/* 메뉴 - 로그인, 회원가입, 도서 목록 페이지로 이동 */}
        <nav>
          <ul>
            {!user && (
              <>
                <li>
                  <Link to="/register">회원가입</Link>
                </li>
                <li>
                  <Link to="/login">로그인</Link>
                </li>
              </>
            )}
            <li>
              <Link to="/books">도서 목록</Link>
            </li>
            {user && (
              <li>
                <button onClick={handleLogout}>로그아웃</button>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          {/* 회원가입 페이지 */}
          <Route path="/register" element={<Register />} />

          {/* 로그인 페이지 */}
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* 도서 목록 페이지 */}
          <Route path="/books" element={<BookList />} />

          {/* 기본 경로 */}
          <Route path="/" element={<h2>홈 페이지</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
