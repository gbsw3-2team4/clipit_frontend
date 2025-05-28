import Anonymous from "/images/Anonymous.png";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface PostCardProps {
  username: string;
  createdAt: string;
  title: string;
  description: string;
  code: string;
  tags: string[];
  onClick?: () => void;
}

const PostCard = ({
  username,
  createdAt,
  title,
  description,
  code,
  tags,
  onClick,
}: PostCardProps) => {
  return (
    <div className="bg-[var(--bg-color)] border-b border-gray-300 mb-6 w-full pb-4">
      {/* 작성자 정보 */}
      <div className="flex items-center gap-3 mb-2">
        <img src={Anonymous} className="w-10 h-10 cursor-pointer" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{username}</span>
          <span className="text-xs text-gray-400">{createdAt}</span>
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
      <div className="rounded-2xl overflow-hidden mb-4">
        <SyntaxHighlighter
          language="javascript"
          style={oneDark}
          customStyle={{
            padding: "1rem",
            fontSize: "0.875rem",
            borderRadius: "1rem",
            background: "#282C34",
          }}
          wrapLongLines
        >
          {code}
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
