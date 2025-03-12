import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Books from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import RentPage from "./pages/RentPage";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/authContext";

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>; // 토큰 체크 중에는 빈 화면 표시
  }

  return accessToken ? children : <Navigate to="/login" replace />;
}

function ProtectedLoginRoute({ children }) {
  const { accessToken, loading } = useAuth();
  const location = useLocation(); // 현재 위치 가져오기

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? <Navigate to={location.pathname} replace /> : children;
}

function App() {
  return (
    <AuthProvider>
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
          <Route
            path="/book-detail"
            element={
              <ProtectedRoute>
                <BookDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rent"
            element={
              <ProtectedRoute>
                <RentPage />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
