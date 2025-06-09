// src/pages/PostDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Anonymous from "/images/Anonymous.png";
import postService, { Post } from "../api/postService";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError("게시글 ID가 없습니다.");
          return;
        }

        // 실제 API 호출
        const fetchedPost = await postService.fetchPostById(id);
        setPost(fetchedPost);
      } catch (err: any) {
        console.error("게시글 조회 에러:", err);

        // 에러 메시지 처리
        if (err.response?.status === 404) {
          setError("게시글을 찾을 수 없습니다.");
        } else if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("게시글을 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 돌아가기
  };

  // 날짜 포맷팅 함수
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-lg text-red-500 mb-4">
          {error || "게시글을 찾을 수 없습니다."}
        </div>
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color)] mt-15">
      {/* 메인 콘텐츠 */}
      <main className="max-w-[1080px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold py-5">{post.title}</h1>
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3">
          <img src={Anonymous} alt="Profile" className="w-8 h-8" />
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm font-semibold">{post.authorId}</span>
            <span>·</span>
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 py-8 mb-5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--bg-sub-color)] text-black rounded-full px-4 py-2 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 설명 */}
        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed">{post.description}</p>
        </div>

        {/* 코드 영역 */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden">
            <SyntaxHighlighter
              language={post.language || "javascript"}
              style={oneDark}
              customStyle={{
                padding: "1.5rem",
                fontSize: "0.95rem",
                borderRadius: "1rem",
                background: "#282C34",
                margin: 0,
              }}
              wrapLongLines
              showLineNumbers
            >
              {post.code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-4 pt-6 border-t border-gray-200 justify-center">
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            목록으로
          </button>
          {/* TODO: 좋아요, 공유 등 추가 기능 버튼들 */}
        </div>
      </main>
    </div>
  );
};

export default PostDetail;
