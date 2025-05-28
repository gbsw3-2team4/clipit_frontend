// MainRoute.tsx
import { useAuth } from "../hooks/useAuth";
import Home from "./Home";
import Explore from "./Explore";

const MainRoute = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Explore /> : <Home />;
};

export default MainRoute;
