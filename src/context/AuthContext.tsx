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

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    authService.isLoggedIn()
  );

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await authService.checkToken();
        const currentUser = authService.getCurrentUser();
        setIsLoggedIn(true);
        setUser(currentUser);
      } catch {
        setIsLoggedIn(false);
        setUser(null);
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
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
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
