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
import Welcome from "./pages/Welcome";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/authContext";

// 일반 사용자 보호 라우트
function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  return accessToken ? children : <Navigate to="/login" replace />;
}

// 로그인한 사용자는 계정 페이지 접근 차단
function ProtectedLoginRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  return accessToken ? <Navigate to="/books-list" replace /> : children;
}

function ProtectedAdminRoute({ children }) {
  const { accessToken, user, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/books-list" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
      <Routes>
        <Route path="/" element={<Welcome />} />
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
