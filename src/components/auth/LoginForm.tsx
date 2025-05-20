import { FormEvent, useLayoutEffect, useState } from "react";
import Button from "../common/Button";
import authService from "../../api/authService";
import ClipitLogo from "/images/ClipitLogo.svg";
import ModalDivider from "/images/ModalDivider.svg";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onErrorChange: (hasError: boolean) => void;
}

const LoginForm = ({
  onSuccess,
  onRegisterClick,
  onErrorChange,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await authService.login({ email, password });
      login(res.user, res.accessToken); // ✅ 전역 상태 업데이트
      onSuccess();
    } catch (err) {
      console.error("로그인 에러:", err);
      setError("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    onErrorChange(!!error);
  }, [error, onErrorChange]);

  return (
    <div className="w-full">
      <img src={ClipitLogo} alt="ClipIt" className="h-7 w-auto mb-2" />
      <h3 className="font-medium mb-6">로그인하기</h3>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="mt-6">
        <div className="mt-6 space-y-4">
          <a
            href="https://clipit-backend.vercel.app/auth/github"
            className="w-full flex cursor-pointer items-center justify-center gap-2 p-3 border border-[var(--border-color)] rounded-full hover:bg-gray-50 transition-colors"
          >
            <FaGithub size={20} /> GitHub로 로그인
          </a>
          <a
            href="https://clipit-backend.vercel.app/auth/google"
            className="w-full flex cursor-pointer items-center justify-center gap-2 p-3 border border-[var(--border-color)] rounded-full hover:bg-gray-50 transition-colors"
          >
            <FcGoogle size={20} /> Google로 로그인
          </a>
        </div>
      </div>
      <div className="relative flex items-center justify-center mt-4">
        <img src={ModalDivider} alt="or" className="w-full" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="이메일 입력"
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="비밀번호 입력"
            disabled={isLoading}
            required
          />
        </div>

        <Button type="submit" fullWidth disabled={isLoading} className="mt-6">
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[var(--text-sub-color)]">
          아직 회원이 아니신가요?{" "}
          <button
            onClick={onRegisterClick}
            className="text-[var(--primary-color)] hover:underline cursor-pointer"
            disabled={isLoading}
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
