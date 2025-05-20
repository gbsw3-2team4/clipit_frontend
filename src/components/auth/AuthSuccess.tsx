import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authService from "../../api/authService";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      navigate("/");
      return;
    }

    const authenticate = async () => {
      try {
        localStorage.setItem("accessToken", accessToken);

        const user = await authService.getUserInfo(); // ✅ 사용자 정보 가져오기
        login(user, accessToken); // ✅ 전역 상태 등록
        navigate("/explore");
      } catch (err) {
        console.error("소셜 로그인 실패:", err);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    authenticate();
  }, [login, navigate, searchParams]);

  return <div>소셜 로그인 처리 중...</div>;
};

export default AuthSuccess;
