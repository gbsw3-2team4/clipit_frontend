import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [modalStep, setModalStep] = useState<0 | 1 | 2>(0); // 0: 로그인, 1: 회원가입, 2: 인증
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [hasRegisterError, setHasRegisterError] = useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);
  const animationDuration = 300;

  const modalHeight = (() => {
    if (modalStep === 0) return hasLoginError ? 700 : 625;
    let height = 600;
    if (isEmailSent) height += 90;
    if (hasRegisterError) height += 60;
    return height;
  })();

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimatingIn(true);
        });
      });
    } else {
      setIsAnimatingIn(false);
      setHasRegisterError(false);
      setHasLoginError(false);
      setIsEmailSent(false);
      document.body.style.overflow = "auto";
      const timeout = setTimeout(() => {
        setIsRendered(false);
      }, animationDuration);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsEmailSent(false);
      setHasRegisterError(false);
      setHasLoginError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (modalStep !== 1) {
      setIsEmailSent(false); // 인증 input 감춤
      setHasRegisterError(false);
      setHasLoginError(false); // 에러도 같이 초기화
    }
  }, [modalStep]);

  // const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
  //   if (e.target === e.currentTarget) onClose();
  // };

  const handleModalSuccess = () => window.location.reload();

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ease-in-out ${
        isAnimatingIn ? "bg-[rgba(0,0,0,0.2)]" : "bg-[rgba(0,0,0,0)]"
      }`}
    >
      <div
        className={`bg-white rounded-3xl shadow-lg w-full max-w-md transform transition duration-300 ease-in-out ${
          isAnimatingIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          height: modalHeight,
          transition: "height 300ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start px-8 pt-8">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer absolute right-0 pr-6 z-50"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative w-full overflow-hidden">
          <div
            className={`flex w-[300%] transition-transform duration-300 ease-in-out ${
              modalStep === 0
                ? "translate-x-0"
                : modalStep === 1
                ? "-translate-x-1/3"
                : "-translate-x-2/3"
            }`}
          >
            <div className="w-1/3 shrink-0 px-8 pb-8">
              {modalStep === 0 && (
                <LoginForm
                  onSuccess={handleModalSuccess}
                  onErrorChange={setHasLoginError}
                  onRegisterClick={() => setModalStep(1)}
                />
              )}
            </div>

            <div className="w-1/3 shrink-0 px-8 pb-8">
              {modalStep === 1 && (
                <RegisterForm
                  onSuccess={handleModalSuccess}
                  onLoginClick={() => setModalStep(0)}
                  onErrorChange={setHasRegisterError}
                  onEmailSentChange={setIsEmailSent}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
