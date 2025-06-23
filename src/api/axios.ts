import axios from "axios";
import authService from "./authService";

const BASE_URL = "http://localhost:3000/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: accessToken을 헤더에 포함
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: accessToken 만료 시 /refresh → 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 (401) + 중복 재요청 방지
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // 토큰 교체 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 403
        ) {
          authService.clearAuth();
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    // 기타 에러는 그대로 전달
    return Promise.reject(error);
  }
);

export default axiosInstance;
