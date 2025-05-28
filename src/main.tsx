import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import Header from "./components/common/Header.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Header />
      <App />
    </AuthProvider>
  </BrowserRouter>
);
