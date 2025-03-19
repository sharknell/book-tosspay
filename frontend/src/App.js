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
import RentPage from "./pages/RentPage";
import Profile from "./pages/Profile";
import { useAuth } from "./context/authContext";

function ProtectedRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? children : <Navigate to="/login" replace />;
}

function ProtectedLoginRoute({ children }) {
  const { accessToken, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return accessToken ? <Navigate to="/books" replace /> : children;
}

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
      <Footer />
    </Router>
  );
}

export default App;
