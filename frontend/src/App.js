import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Account from "./pages/Account";
import BooksList from "./pages/BookList";
import BookDetail from "./pages/BookDetail";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFail from "./pages/payment/PaymentFail";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/authContext";
import ProtectedAdminRoute from "./ProjectedAdminRoute.js/ProjectedAdminRoute";

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
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
      <Routes>
        <Route
          path="/account"
          element={
            <ProtectedLoginRoute>
              <Account />
            </ProtectedLoginRoute>
          }
        />
        <Route path="/books-list" element={<BooksList />} />
        <Route path="/books-list/:id" element={<BookDetail />} />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/fail"
          element={
            <ProtectedRoute>
              <PaymentFail />
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
        <Route
          path="/admindashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
