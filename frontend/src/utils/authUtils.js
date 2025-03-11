export const getAccessToken = () => localStorage.getItem("accessToken");
// src/utils/authUtils.js
export const getRefreshToken = () => {
  return sessionStorage.getItem("refreshToken");
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login"; // 로그인 페이지로 리디렉트
};
