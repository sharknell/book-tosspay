// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", // 백엔드 서버 URL
});

export const registerUser = async (email, username, password) => {
  try {
    const response = await api.post("/register", { email, username, password });
    return response.data;
  } catch (error) {
    throw new Error("회원가입 실패");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    console.log("accountService:" + response.data);

    return response.data;
  } catch (error) {
    throw new Error("로그인 실패");
  }
};
