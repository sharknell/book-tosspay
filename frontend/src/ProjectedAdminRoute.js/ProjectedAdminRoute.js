// ProtectedAdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// 관리자 권한을 가진 사용자만 접근할 수 있게 설정
function ProtectedAdminRoute({ children }) {
  const { accessToken, user, loading } = useAuth();

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!accessToken || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
