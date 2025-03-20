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
import Books from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import { useAuth } from "./context/authContext";

// ProtectedRoute는 접근 제어를 담당하는 컴포넌트로 로그인 상태에 따라 페이지 접근을 제어합니다.
function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? children : <Navigate to="/login" replace />;
}

// ProtectedLoginRoute는 로그인 상태에서 로그인 페이지 접근을 방지하는 컴포넌트입니다.
function ProtectedLoginRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? <Navigate to="/books" replace /> : children;
}

// App 컴포넌트 내에서 각 라우트에 보호 기능을 추가
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
        <Route path="/books" element={<Books />} />

        {/* /book-detail, /rent, /profile 페이지는 로그인 필수 */}
        <Route
          path="/book-detail"
          element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          }
        />
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
