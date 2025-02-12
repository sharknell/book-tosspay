import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Books from "./pages/BookList";
import BookDetail from "./pages/BookDetail";

function ProtectedLoginRoute({ user, children }) {
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    if (user && !alertShown) {
      alert("이미 로그인되어 있습니다.");
      setAlertShown(true);
    }
  }, [user, alertShown]);

  if (user) {
    return <Navigate to="/books" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 추가된 로딩 상태

  useEffect(() => {
    // 로컬스토리지에서 사용자 정보를 안전하게 불러오기
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // 사용자 정보를 객체로 변환하여 상태에 저장
      } catch (error) {
        console.error(
          "로컬 저장된 사용자 정보를 불러오는 중 오류 발생:",
          error
        );
      }
    }
    setLoading(false); // 로딩 완료 처리
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // 로그인 상태 변경 시 로컬 스토리지에 저장
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null); // 로그아웃 시 상태 초기화
    localStorage.removeItem("user"); // 로컬 스토리지에서 사용자 정보 삭제
    alert("로그아웃되었습니다.");
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 화면에 표시
  }

  return (
    <Router>
      <Header user={user} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedLoginRoute user={user}>
              <Login setUser={setUser} />
            </ProtectedLoginRoute>
          }
        />
        <Route path="/books" element={<Books user={user} />} />
        <Route path="/book-detail" element={<BookDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
