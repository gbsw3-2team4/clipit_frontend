// src/context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";
import { ThemeKey } from "../styles/syntaxThemes";

interface ThemeContextType {
  codeTheme: ThemeKey;
  setCodeTheme: (theme: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // localStorage에서 저장된 테마 불러오기, 없으면 기본값 'oneDark'
  const [codeTheme, setCodeTheme] = useState<ThemeKey>(() => {
    const savedTheme = localStorage.getItem("codeTheme");
    return (savedTheme as ThemeKey) || "oneDark";
  });

  // 테마 변경 시 localStorage에 저장
  const handleSetCodeTheme = (theme: ThemeKey) => {
    setCodeTheme(theme);
    localStorage.setItem("codeTheme", theme);
  };

  return (
    <ThemeContext.Provider
      value={{ codeTheme, setCodeTheme: handleSetCodeTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
