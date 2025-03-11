import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  logout,
} from "./authUtils";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// 요청 인터셉터 (AccessToken 자동 추가)
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (403 발생 시 자동으로 토큰 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        const res = await axios.post("http://localhost:5001/api/refresh", {
          refreshToken,
        });
        setAccessToken(res.data.accessToken);

        // 새로운 액세스 토큰으로 기존 요청 다시 시도
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
// This is the end of the file
