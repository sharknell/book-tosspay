// src/pages/Register.js
import React, { useState } from "react";
import { registerUser } from "../services/accountService"; // API 요청 함수

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(email, username, password);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="register">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Register;
