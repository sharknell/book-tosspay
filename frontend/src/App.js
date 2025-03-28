import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BooksList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import { useAuth } from "./context/authContext";

// 보호된 경로 처리
function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? children : <Navigate to="/login" replace />;
}

// 로그인 상태에서는 로그인 및 회원가입 페이지 접근 차단
function ProtectedLoginRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? <Navigate to="/books-list" replace /> : children;
}

// 메인 라우트 설정
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedLoginRoute>
              <Login />
            </ProtectedLoginRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedLoginRoute>
              <Register />
            </ProtectedLoginRoute>
          }
        />
        <Route path="/books-list" element={<BooksList />} />
        <Route path="/books-list/detail/:isbn" element={<BookDetail />} />{" "}
        {/* 🔥 수정된 부분 */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
