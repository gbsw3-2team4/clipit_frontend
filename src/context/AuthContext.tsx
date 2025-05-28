import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import authService, { User } from "../api/authService";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<
  (AuthContextType & { isLoading: boolean }) | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    authService.isLoggedIn()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        await authService.checkToken();

        // ✅ 유효한 토큰이면 유저 정보 API로부터 새로 받아오기
        const currentUser = await authService.getUserInfo();
        setUser(currentUser);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
        authService.clearAuth(); // 실패 시 클린업
      } finally {
        setIsLoading(false);
      }
    };

    checkLogin();
  }, []);

  const login = (user: User, token: string) => {
    authService.saveUser(user);
    localStorage.setItem("accessToken", token);
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    authService.clearAuth();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
