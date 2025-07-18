// src/pages/PostCreate.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { syntaxStyles } from "../styles/syntaxThemes";
import { useTheme } from "../context/ThemeContext";
import Language from "/icons/code_language.svg";
import Arrow from "/icons/code_arrow.svg";

import Button from "../components/common/Button";
import postService, { CreatePostRequest } from "../api/postService";

interface PostFormData {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

const PostCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { codeTheme } = useTheme();
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    description: "",
    code: "",
    language: "javascript",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 언어 옵션들 (임시로 몇 개만 추가)
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "json", label: "JSON" },
  ];

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!formData.code.trim()) {
      setError("코드를 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 실제 API 호출
      const postData: CreatePostRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        tags: formData.tags,
      };

      const newPost = await postService.createPost(postData);
      console.log("게시글 작성 성공:", newPost);
      // 성공 시 작성된 게시글 상세 페이지로 이동
      navigate(`/posts/${newPost.id}`);
    } catch (err: any) {
      console.error("게시글 작성 에러:", err);

      // 에러 메시지 처리
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("로그인이 필요합니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 403) {
        setError("게시글 작성 권한이 없습니다.");
      } else {
        setError("게시글 작성에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      {/* 헤더 영역 */}
      <div className="h-36 bg-[var(--bg-sub-color)] mt-15 flex items-center justify-center">
        <h1>새 코드 조각 작성</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-[1080px] mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          {/* 제목 입력 */}
          <div>
            <label htmlFor="title" className="block font-medium mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60자 이내 작성"
              disabled={isLoading}
              maxLength={60}
              required
            />
          </div>

          {/* 설명 입력 */}
          <div>
            <label htmlFor="description" className="block font-medium mb-2">
              설명
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="180자 이내 작성"
              rows={3}
              disabled={isLoading}
              maxLength={180}
            />
          </div>

          {/* 태그 입력 */}
          <div>
            <label htmlFor="tagInput" className="block font-medium mb-2">
              태그
            </label>
            <div className="flex gap-2 mb-3">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="태그를 입력하고 Enter를 누르세요"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || isLoading}
                className="rounded-lg"
              >
                추가
              </Button>
            </div>

            {/* 태그 목록 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[var(--bg-sub-color)] text-black px-3 py-2 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-600 hover:text-gray-800"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 코드 입력 */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-2">
              코드 <span className="text-red-500">*</span>
            </label>

            {/* 언어 선택 */}
            <div className="relative w-[240px] h-[36px] mb-3 flex">
              {/* Icon */}
              <img
                src={Language}
                alt="Language"
                className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4"
              />

              <p className="absolute text-sm top-6.5 left-9 transform -translate-y-1/2 w-4 h-full text-gray-300">
                |
              </p>
              {/* Select box */}
              <select
                value={formData.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="w-full h-full appearance-none pl-12.5 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={isLoading}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Right arrow */}
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <img src={Arrow} alt="v" />
              </div>
            </div>

            {/* 코드 영역 - 항상 하이라이팅된 상태로 표시 */}
            <div className="relative">
              <textarea
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                className="absolute inset-0 w-full h-full p-4 bg-transparent text-transparent caret-white resize-none font-mono text-[1rem] z-10 focus:outline-none"
                placeholder=""
                disabled={isLoading}
                required
                style={{
                  minHeight: "400px",
                  color: "transparent",
                  caretColor: "white",
                }}
              />
              <div className="rounded-lg overflow-hidden border border-gray-300">
                <SyntaxHighlighter
                  language={formData.language}
                  style={syntaxStyles[codeTheme]} // <- 변경
                  customStyle={{
                    padding: "1rem",
                    fontSize: "0.875rem",
                    margin: 0,
                    minHeight: "400px",
                    fontFamily: "monospace",
                  }}
                  wrapLongLines
                >
                  {formData.code || `// console.log("Hello World")`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 pt-6 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "작성 중..." : "업로드"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PostCreate;
