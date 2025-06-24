// src/components/post/PostCard.tsx
import Anonymous from "/images/Anonymous.png";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { syntaxStyles } from "../../styles/syntaxThemes";
import { useTheme } from "../../context/ThemeContext";

interface Author {
  id: string;
  name: string;
  email: string;
}

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  language?: string;
  tags: string[];
  author?: Author;
  createdAt: string;
  updatedAt: string;
  onClick?: () => void;
}

const PostCard = ({
  title,
  description,
  code,
  language = "javascript",
  tags,
  author,
  createdAt,
  onClick,
}: PostCardProps) => {
  // 작성자 ID를 그대로 표시
  const displayName = author?.name || "알 수 없는 사용자";
  const { codeTheme } = useTheme();

  // 코드 10줄로 제한
  const truncateCode = (code: string, maxLines: number = 10) => {
    const lines = code.split("\n");
    if (lines.length <= maxLines) {
      return code;
    }
    const truncatedLines = lines.slice(0, maxLines);
    return truncatedLines.join("\n") + "\n...";
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 1) {
        return "방금 전";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
      } else if (diffDays === 1) {
        return "어제";
      } else if (diffDays < 7) {
        return `${diffDays}일 전`;
      } else {
        return date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      return dateString; // 파싱 실패 시 원본 반환
    }
  };

  return (
    <div className="bg-[var(--bg-color)] border-b border-gray-300 mb-6 w-full pb-4">
      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={Anonymous}
          className="w-10 h-10 cursor-pointer"
          alt="프로필"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{displayName}</span>
          <span className="text-xs text-gray-400">{formatDate(createdAt)}</span>
        </div>
      </div>

      {/* 제목 */}
      <h2
        className="text-lg font-bold mb-1 cursor-pointer underline-offset-1 hover:underline"
        onClick={onClick}
      >
        {title}
      </h2>

      {/* 설명 */}
      <p className="text-sm text-gray-700 mb-3">{description}</p>

      {/* 코드 영역 */}
      <div className="rounded-2xl overflow-hidden mb-4 border border-[var(--border-color)]">
        <SyntaxHighlighter
          language={language}
          style={syntaxStyles[codeTheme]}
          customStyle={{
            padding: "1rem",
            fontSize: "0.875rem",
            borderRadius: "1rem",
            background: "#282C34",
            maxHeight: "auto",
          }}
          wrapLongLines
        >
          {truncateCode(code)}
        </SyntaxHighlighter>
      </div>

      {/* 태그 */}
      <div className="flex justify-between flex-wrap gap-2 right-0">
        <div></div>
        <div className="flex flex-row gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--bg-sub-color)] text-black rounded-full px-3 py-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
