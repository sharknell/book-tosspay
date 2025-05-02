import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Login from "../components/Login";
import Register from "../components/Register";
import "../styles/Account.css"; // 스타일을 위한 CSS import

const Account = () => {
  // 알림 예시 처리 함수
  const showToast = (message) => {
    toast.success(message);
  };

  return (
    <div className="account-container">
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />

      <div className="account-section">
        <Login showToast={showToast} />
      </div>

      <div className="account-section">
        <Register showToast={showToast} />
      </div>
    </div>
  );
};

export default Account;
