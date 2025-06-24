// src/pages/Settings.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/common/Button";
import Anonymous from "/images/Anonymous.png";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Language from "/icons/code_language.svg";
import Picture from "/icons/set_picture.svg";
import Arrow from "/icons/code_arrow.svg";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { syntaxStyles, ThemeKey, themeLabels } from "../styles/syntaxThemes";

const Settings = () => {
  const { user, isLoading } = useAuth();
  const { codeTheme, setCodeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "code">("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [tempCodeTheme, setTempCodeTheme] = useState<ThemeKey>(codeTheme);

  // 현재 선택된 하이라이트 테마 스타일
  const getCurrentThemeStyle = () => syntaxStyles[tempCodeTheme];

  // 샘플 코드 (프리뷰용)
  const sampleCode = `const greet = (name) => console.log(\`Hello, \${name}\`);

class User {
  constructor(name) { this.name = name; }
  sayHello() { return \`I am \${this.name}\`; }
}

greet(new User("ClipIt").sayHello()); // Hello, I'm ClipIt!`;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">로그인되지 않았습니다.</div>
      </div>
    );
  }

  const handleProfileSave = () => {
    // TODO: API 호출하여 프로필 저장
    console.log("Saving profile:", profileData);
    setIsEditingProfile(false);
  };

  const handleCodeThemeSave = () => {
    // Context를 통해 전역 테마 변경
    setCodeTheme(tempCodeTheme);
    alert("코드 하이라이트 테마가 저장되었습니다.");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      {/* 헤더 영역 */}
      <div className="h-36 bg-[var(--bg-sub-color)] mt-15 flex items-center justify-center">
        <h1 className="font-bold">설정</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1080px] mx-auto px-4">
        <div className="flex gap-8">
          {/* 사이드바 네비게이션 */}
          <aside className="w-64 shrink-0">
            <nav className="space-y-0">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full border-b border-[var(--border-color)] text-left px-4 py-5 transition-colors flex items-center gap-3 ${
                  activeTab === "profile"
                    ? "bg-[var(--bg-sub-color)] text-[var(--text-color)] font-medium"
                    : "text-[var(--text-sub-color)] hover:bg-gray-50"
                }`}
              >
                <span className="text-base">개인정보</span>
                <span className="ml-auto">→</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`w-full text-left px-4 py-5 border-t border-b border-[var(--border-color)] transition-colors flex items-center gap-3 ${
                  activeTab === "code"
                    ? "bg-[var(--bg-sub-color)] text-[var(--text-color)] font-medium"
                    : "text-[var(--text-sub-color)] hover:bg-gray-50"
                }`}
              >
                <span className="text-base">디스플레이</span>
                <span className="ml-auto">→</span>
              </button>
            </nav>
          </aside>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 bg-white rounded-lg">
            {activeTab === "profile" ? (
              <div className="space-y-6 py-8">
                <h2 className="text-xl font-bold mb-6">프로필 사진</h2>

                {/* 프로필 이미지 */}
                <div className="flex items-center gap-4 mb-8 rounded-lg p-5 border border-[var(--border-color)]">
                  <img
                    src={Anonymous}
                    alt="프로필"
                    className="w-25 h-25 rounded-full"
                  />
                  <div className="flex flex-col gap-3">
                    <label className="px-2 py-3 transition-all bg-[var(--primary-color)] text-white hover:bg-[var(--primary-hover)] rounded-full cursor-pointer flex justify-center items-center gap-2 w-[140px] y-[40px]">
                      <img src={Picture} alt="" />
                      이미지 변경
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        // onChange={...} // 업로드 처리 추후 구현
                      />
                    </label>
                    <span className="text-sm text-[var(--text-sub-color)] leading-loose">
                      PNG, JPEG: 500 × 500 px
                    </span>
                  </div>
                </div>

                {/* 입력 필드들 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      이름
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        placeholder="LAVEN"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 bg-[var(--bg-sub-color)] rounded-lg">
                        {user.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      이메일
                    </label>
                    <div className="w-full px-4 py-3 bg-[var(--bg-sub-color)] rounded-lg text-[var(--text-sub-color)]">
                      {user.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      홈페이지
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                        placeholder="홈페이지 주소를 입력하세요."
                      />
                    ) : (
                      <div className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg text-[var(--text-sub-color)]">
                        홈페이지 주소를 입력하세요.
                      </div>
                    )}
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-center pt-8">
                  {isEditingProfile ? (
                    <div className="flex gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-8 py-3"
                      >
                        취소
                      </Button>
                      <Button variant="primary" onClick={handleProfileSave}>
                        저장
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-8 py-3"
                    >
                      저장
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6 py-8">
                <h2 className="text-xl font-bold mb-6">코드 하이라이트</h2>
                <p className="text-[var(--text-sub-color)] mb-4">
                  코드의 테마 색상 스타일을 코드의 가독성을 높일 수 있습니다.
                </p>

                {/* 테마 선택 */}
                <div className="relative w-full">
                  <div className="absolute top-3 left-3 z-10">
                    <img src={Language} alt="Language" className="w-5 h-5" />
                  </div>
                  <select
                    value={tempCodeTheme}
                    onChange={(e) =>
                      setTempCodeTheme(e.target.value as ThemeKey)
                    }
                    className="w-full h-12 appearance-none pl-12 pr-10 text-sm border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white"
                  >
                    {Object.entries(themeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
                    <img src={Arrow} alt="Arrow" className="w-4 h-4" />
                  </div>
                </div>

                {/* 코드 프리뷰 */}
                <div className="mt-6 rounded-lg overflow-hidden border border-[var(--border-color)]">
                  <SyntaxHighlighter
                    language="javascript"
                    style={getCurrentThemeStyle()}
                    customStyle={{
                      padding: "1.5rem",
                      fontSize: "0.875rem",
                      borderRadius: "0.5rem",
                      margin: 0,
                    }}
                    wrapLongLines
                  >
                    {sampleCode}
                  </SyntaxHighlighter>
                </div>

                {/* 저장 버튼 */}
                <div className="flex justify-center pt-8">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleCodeThemeSave}
                  >
                    저장
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
