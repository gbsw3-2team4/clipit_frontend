import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AuthSuccess from "./components/auth/AuthSuccess";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
    </Routes>
  );
};

export default App;
