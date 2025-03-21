import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password); // 로그인 함수 호출
    if (success) {
      alert("로그인 성공!");
      navigate("/books"); // 로그인 성공 후 /books로 이동
    } else {
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label className="login-form-label">Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="login-form-label">Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
        <p>
          아직 회원이 아니신가요?
          <Link to="/register" className="signup-link">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
