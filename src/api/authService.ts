import axiosInstance from "./axios";

// 사용자 타입 정의
export interface User {
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  code: string;
}

// 회원가입 응답 타입
export interface RegisterResponse {
  user: User;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  accessToken: string;
  user: User;
}

// 로그아웃 응답 타입
export interface LogoutResponse {
  message: string;
}

// 토큰 확인 응답 타입
export interface CheckTokenResponse {
  message: string;
}

// 인증 관련 서비스 클래스
class AuthService {
  // 회원가입
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axiosInstance.post<RegisterResponse>(
      "/users/register",
      data
    );
    return response.data;
  }

  // 로그인
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      "/users/login",
      data
    );

    // 액세스 토큰을 로컬 스토리지에 저장
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
    }

    return response.data;
  }

  // 로그아웃
  async logout(): Promise<LogoutResponse> {
    const response = await axiosInstance.post<LogoutResponse>("/users/logout");

    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");

    return response.data;
  }

  // 토큰 유효성 검사
  async checkToken(): Promise<CheckTokenResponse> {
    const response = await axiosInstance.post<CheckTokenResponse>(
      "/users/check-token"
    );
    return response.data;
  }

  // 이메일 인증 요청
  async sendEmailCode(email: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      "/users/send-mail",
      {
        email,
      }
    );
    return response.data;
  }

  // 이메일 인증 확인
  async verifyCode(email: string, code: string): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(
      "/users/verify-code",
      { email, code }
    );
    return response.data;
  }

  // 유저 정보 조회 API (토큰 필요)
  async getUserInfo(): Promise<User> {
    const response = await axiosInstance.get<User>("/users/me");
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  }

  // 현재 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  // 현재 사용자 정보 가져오기
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
    return null;
  }

  // 사용자 정보 저장
  saveUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // 사용자 정보 제거
  clearUser(): void {
    localStorage.removeItem("user");
  }

  // 모든 인증 정보 제거 (로그아웃 시 유용)
  clearAuth(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const authService = new AuthService();
export default authService;
