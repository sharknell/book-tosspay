import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/accountService";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);
      console.log("로그인 응답 데이터:", data); // 응답 확인

      if (data.accessToken) {
        const userInfo = {
          email,
          username: data.username || email.split("@")[0], // username이 없으면 email 앞부분 사용
          token: data.accessToken,
        };
        console.log("저장할 사용자 정보:", userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(userInfo);
        alert("로그인 성공!");
        navigate("/books");
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
