// src/pages/PostDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { syntaxStyles } from "../styles/syntaxThemes";
import { useTheme } from "../context/ThemeContext";
import Anonymous from "/images/Anonymous.png";
import postService, { Post } from "../api/postService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { codeTheme } = useTheme();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteModalRendered, setIsDeleteModalRendered] = useState(false);
  const [isDeleteModalAnimatingIn, setIsDeleteModalAnimatingIn] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError("게시글 ID가 없습니다.");
          return;
        }

        const fetchedPost = await postService.fetchPostById(id);
        setPost(fetchedPost);
      } catch (err: any) {
        console.error("게시글 조회 에러:", err);

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

  // 삭제 모달 애니메이션 처리
  useEffect(() => {
    if (showDeleteModal) {
      setIsDeleteModalRendered(true);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsDeleteModalAnimatingIn(true);
        });
      });
    } else {
      setIsDeleteModalAnimatingIn(false);
      document.body.style.overflow = "auto";
      const timeout = setTimeout(() => {
        setIsDeleteModalRendered(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [showDeleteModal]);

  // 드롭다운 외부 클릭 감지
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

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    setIsDropdownOpen(false);
    navigate(`/posts/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setIsDropdownOpen(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!id) return;

    try {
      setIsDeleting(true);
      await postService.deletePost(id);
      navigate("/explore", { replace: true });
    } catch (err: any) {
      console.error("게시글 삭제 에러:", err);
      alert(err.response?.data?.message || "게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

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
      return dateString;
    }
  };

  const isAuthor =
    user &&
    post &&
    ((post.author && user.email === post.author.email) ||
      (!post.author && user.email === post.authorId));

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="md" />
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
      <main className="max-w-[1080px] mx-auto px-4 py-15">
        <div className="flex justify-between items-start mb-5">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {isAuthor && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg rotate-90 transition"
                aria-label="더보기 메뉴"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-10 w-36 p-2 bg-white border border-[var(--border-color)] rounded-2xl shadow-md z-50">
                  <button
                    onClick={handleEditClick}
                    className="w-full px-3 py-2.5 text-left text-[var(--text-color)] hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="w-full px-3 py-2.5 text-left text-red-500 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <img src={Anonymous} alt="Profile" className="w-8 h-8" />
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm font-semibold">
              {post.author ? post.author.name : post.authorId}
            </span>
            <span>·</span>
            <span className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span>·</span>
                <span className="text-sm text-gray-500">(수정됨)</span>
              </>
            )}
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

        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed">{post.description}</p>
        </div>

        {/* 코드 영역 - Settings에서 선택한 테마 적용 */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden border border-[var(--border-color)]">
            <SyntaxHighlighter
              language={post.language || "javascript"}
              style={syntaxStyles[codeTheme]} // Context에서 가져온 테마 사용
              customStyle={{
                padding: "1.5rem",
                fontSize: "0.95rem",
                borderRadius: "1rem",
                margin: 0,
              }}
              wrapLongLines
              showLineNumbers
            >
              {post.code}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-200 justify-center">
          <Button onClick={handleBackClick} variant={"secondary"}>
            목록으로
          </Button>
        </div>
      </main>

      {isDeleteModalRendered && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-300 ease-in-out ${
            isDeleteModalAnimatingIn
              ? "bg-[rgba(0,0,0,0.2)]"
              : "bg-[rgba(0,0,0,0)]"
          }`}
        >
          <div
            className={`bg-white rounded-3xl shadow-lg w-full max-w-md transform transition duration-300 ease-in-out ${
              isDeleteModalAnimatingIn
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 pt-8 pb-8">
              <h3 className="text-xl font-bold mb-4">게시글 삭제</h3>
              <p className="text-gray-600 mb-8">
                정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수
                없습니다.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                  disabled={isDeleting}
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
