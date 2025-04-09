import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast.success("✅ 로그인 성공!");
      navigate("/books-list");
    } else {
      toast.error("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <p>
          아직 회원이 아니신가요?{" "}
          <Link to="/register" className="signup-link">
            회원가입
          </Link>
        </p>
      </form>
      <ToastContainer position="top-center" autoClose={2000} theme="colored" />
    </div>
  );
};

export default Login;
