//App.tsx
import { Routes, Route } from "react-router-dom";
import MyCode from "./pages/MyCode.tsx";
import Settings from "./pages/Settings.tsx";
import AuthSuccess from "./components/auth/AuthSuccess";
import PrivateRoute from "./routes/PrivateRoute.tsx";
import MainRoute from "./pages/MainRoute.tsx";
import PostDetail from "./pages/PostDetail.tsx";
import PostCreate from "./pages/PostCreate.tsx";
import PostEdit from "./pages/PostEdit.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainRoute />} />
      <Route
        path="/posts/:id"
        element={
          <PrivateRoute>
            <PostDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/:id/edit"
        element={
          <PrivateRoute>
            <PostEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/new"
        element={
          <PrivateRoute>
            <PostCreate />
          </PrivateRoute>
        }
      />
      <Route
        path="/my-code"
        element={
          <PrivateRoute>
            <MyCode />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/auth/success" element={<AuthSuccess />} />
    </Routes>
  );
};

export default App;
