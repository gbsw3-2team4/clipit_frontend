import { useState, FormEvent, useEffect } from "react";
import Button from "../common/Button";
import authService from "../../api/authService";
import ClipitLogo from "/images/ClipitLogo.svg";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
  onErrorChange: (hasError: boolean) => void;
  onEmailSentChange: (sent: boolean) => void;
}

const RegisterForm = ({
  onSuccess,
  onLoginClick,
  onErrorChange,
  onEmailSentChange,
}: RegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const canSubmit =
    !isLoading &&
    isVerified &&
    name.trim() &&
    password.length >= 4 &&
    password === confirmPassword;

  const { login } = useAuth();

  useEffect(() => {
    onErrorChange(!!error);
  }, [error, onErrorChange]);

  const handleSendCode = async () => {
    if (!email.includes("@")) {
      setError("이메일 형식을 확인해주세요.");
      return;
    }

    try {
      setIsEmailSending(true);
      setError(null);
      await authService.sendEmailCode(email);
      setIsEmailSent(true);
      onEmailSentChange(true);
      alert("인증 코드가 전송되었습니다.");
    } catch (err) {
      console.error("이메일 전송 실패:", err);
      setError("이메일 전송에 실패했습니다.");
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!authCode || authCode.length < 4) {
      setError("인증 코드를 입력해주세요.");
      return;
    }

    try {
      setIsVerifying(true);
      setError(null);
      await authService.verifyCode(email, authCode);
      setIsVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (err) {
      console.error("인증 실패:", err);
      setError("인증 코드가 올바르지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !name.trim() || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (!email.includes("@")) {
      setError("이메일 형식을 확인해주세요.");
      return;
    }

    if (password.length < 4) {
      setError("비밀번호는 최소 4자리 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!authCode || !isVerified) {
      setError("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await authService.register({ name, email, password, code: authCode });
      const loginRes = await authService.login({ email, password });

      login(loginRes.user, loginRes.accessToken);
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <img src={ClipitLogo} alt="ClipIt" className="h-7 w-auto mb-2" />
      <h3 className="font-medium mb-6">회원가입하기</h3>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 + 인증 버튼 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pr-28 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
              placeholder="이메일 입력"
              disabled={isEmailSending || isLoading}
            />
            <button
              type="button"
              onClick={handleSendCode}
              className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer px-3 py-2 bg-[var(--primary-color)] text-white text-sm rounded-md hover:bg-[var(--primary-hover)] transition"
              disabled={isEmailSending}
            >
              {isEmailSending ? "전송 중..." : "이메일 인증"}
            </button>
          </div>
        </div>

        {/* 인증 코드 입력 */}
        {isEmailSent && (
          <div className="transition-all duration-300 max-h-28 opacity-100 mt-1">
            <label
              htmlFor="authCode"
              className="block text-sm font-medium mb-1"
            >
              인증 코드
            </label>
            <div className="relative">
              <input
                id="authCode"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="w-full p-3 pr-24 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                placeholder="인증 코드 입력"
                disabled={isVerifying || isLoading}
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer px-3 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
                disabled={isVerifying}
              >
                {isVerifying ? "검증 중..." : "확인"}
              </button>
            </div>
          </div>
        )}

        {/* 이름 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="이름 입력"
            disabled={isLoading}
            required
          />
        </div>

        {/* 비밀번호 */}
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
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
            placeholder="비밀번호 재입력"
            disabled={isLoading}
          />
        </div>

        <Button fullWidth={true} type="submit" disabled={!canSubmit}>
          {isLoading ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[var(--text-sub-color)]">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={onLoginClick}
            className="text-[var(--primary-color)] hover:underline cursor-pointer"
            disabled={isLoading}
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
