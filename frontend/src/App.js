import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Books from "./pages/BookList";

function App() {
  const [user, setUser] = useState(null);

  // 새로고침 시 localStorage에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // JSON 문자열을 객체로 변환
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // 저장된 사용자 정보 삭제
    setUser(null); // 상태 초기화
    alert("로그아웃되었습니다.");
  };

  return (
    <Router>
      <Header user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </Router>
  );
}

export default App;
