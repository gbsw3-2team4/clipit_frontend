// main.tsx
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import Header from "./components/common/Header.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <Header />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
