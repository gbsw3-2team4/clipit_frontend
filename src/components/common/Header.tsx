import { Link, useNavigate } from "react-router-dom";
import ClipitLogo from "/images/ClipitLogo.svg";
import Pencil from "/icons/pencil.svg";
import DropBookmark from "/icons/drop_bookmark.svg";
import DropSetting from "/icons/drop_setting.svg";
import DropLogout from "/icons/drop_logout.svg";
import Profile from "/images/Anonymous.png";
import { useState, useRef, useEffect } from "react";
import LoginModal from "../auth/LoginModal";
import { useAuth } from "../../hooks/useAuth"; // Context 사용

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isLoggedIn, logout } = useAuth(); // 전역 상태 사용

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // 전역 상태에서 로그아웃
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="w-full h-[3.75rem] fixed top-0 left-0 bg-[var(--bg-color)] z-30 border-b border-[var(--border-color)] shadow-[var(--box-shadow)]">
        <div className="w-full h-full max-w-[1440px] flex justify-between items-center px-6 mx-auto">
          {/* Left */}
          <div className="flex flex-row items-center gap-6">
            <Link to="/">
              <img
                src={ClipitLogo}
                alt="ClipIt"
                className="h-6 w-auto shrink-0"
              />
            </Link>
            {isLoggedIn && (
              <>
                <div className="text-gray-300">|</div>
                {/* <Link to="/explore">탐색하기</Link> */}
                <Link to="/my-code">내 코드</Link>
              </>
            )}
          </div>

          {/* Right */}
          <nav className="flex flex-row items-center gap-6 relative">
            {!isLoggedIn ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="hover:bg-[var(--bg-sub-color)] rounded-full cursor-pointer flex w-16 h-9 items-center justify-center bg-[color:var(--bg-color)] text-[color:var(--text-color)] border border-[color:var(--border-color)] shadow-[var(--box-shadow)] text-base transition-[background] duration-[0.2s] border-solid"
              >
                로그인
              </button>
            ) : (
              <div
                className="flex flex-row items-center gap-6 relative"
                ref={dropdownRef}
              >
                <div></div>
                <div
                  onClick={() => navigate("/posts/new")}
                  className="w-9 h-9 rounded-full bg-[var(--primary-color)] flex items-center justify-center cursor-pointer hover:bg-[var(--primary-hover)] transition"
                >
                  <img src={Pencil} className="w-4 h-4" />
                </div>
                <img
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-gray-300 cursor-pointer"
                  src={Profile}
                  alt="프로필 사진"
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 top-11 w-48 p-2.5 flex flex-col gap-2 bg-white border border-[var(--border-color)] rounded-2xl shadow-md z-50">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/my-code");
                      }}
                      className="w-full px-2 py-3 text-left text-[var(--text-color)] hover:bg-gray-100 rounded-lg cursor-pointer flex flex-row gap-3 text-[1rem]"
                    >
                      <img src={DropBookmark} alt="" />
                      북마크
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full px-2 py-3 text-left text-[var(--text-color)] hover:bg-gray-100 rounded-lg cursor-pointer flex flex-row gap-3 text-[1rem]"
                    >
                      <img src={DropSetting} alt="" />
                      설정
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-2 py-3 text-left text-[#E54040] hover:bg-gray-100 rounded-lg cursor-pointer flex flex-row gap-3 text-[1rem]"
                    >
                      <img src={DropLogout} alt="" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Header;
