// src/pages/Login.js
import React, { useState } from "react";
import { loginUser } from "../services/accountService"; // API 요청 함수

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      if (data.accessToken) {
        setUser({ email }); // 로그인 성공 시 사용자 정보 상태 업데이트
        alert("로그인 성공!");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      alert("로그인 요청 오류");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
