import React, { useState } from "react";
import { registerUser } from "../services/accountService"; // API 요청 함수
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import "../styles/Register.css"; // CSS 파일 import
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(email, username, password);
      setMessage(data.message);

      // 회원가입 성공 후 5초 뒤에 로그인 페이지로 이동
      setTimeout(() => {
        toast.success("회원가입 성공! 5초 후 로그인 페이지로 이동합니다.");
        navigate("/login"); // 로그인 페이지로 이동
      }, 5000); // 5000ms (5초)
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">회원가입</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
      {message && <p>{message}</p>}
      <div className="login-link">
        <p>
          이미 계정이 있나요? <a href="/login">로그인</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
