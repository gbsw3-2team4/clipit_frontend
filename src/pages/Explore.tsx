// src/pages/Explore.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import TagFilter from "../components/post/TagFilter";
import postService, { Post } from "../api/postService";

const Explore = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState("전체");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Intersection Observer 참조
  const observerRef = useRef<HTMLDivElement>(null);

  // 게시글 로드 함수
  const loadPosts = useCallback(
    async (page: number, isFirstLoad: boolean = false) => {
      if (isLoading) return;

      try {
        setIsLoading(true);
        setError(null);

        const newPosts = await postService.fetchPosts(page, 10);

        if (isFirstLoad) {
          setPosts(newPosts);
        } else {
          setPosts((prev) => {
            const existingIds = new Set(prev.map((post) => post.id));
            const uniqueNewPosts = newPosts.filter(
              (post) => !existingIds.has(post.id)
            );
            return [...prev, ...uniqueNewPosts];
          });
        }

        setHasNextPage(newPosts.length === 10);
        setCurrentPage(page);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("게시글을 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  // 태그별 필터링
  const filteredPosts =
    selectedTag === "전체"
      ? posts
      : posts.filter((post) =>
          post.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
          )
        );

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasNextPage &&
          !isLoading &&
          selectedTag === "전체"
        ) {
          const nextPage = currentPage + 1;
          loadPosts(nextPage, false);
        }
      },
      {
        threshold: 1.0,
        rootMargin: "100px",
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isLoading, currentPage, selectedTag, loadPosts]);

  // 컴포넌트 마운트 시 첫 페이지 로드
  useEffect(() => {
    loadPosts(1, true);
  }, []);

  // 태그 변경 시 필터링만 적용 (새로 로드하지 않음)
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  // 재시도 핸들러
  const handleRetry = () => {
    setPosts([]);
    setCurrentPage(1);
    setHasNextPage(true);
    loadPosts(1, true);
  };

  return (
    <div>
      {/* 헤더 영역 */}
      <div className="h-36 bg-[var(--bg-sub-color)] mt-15 flex items-center justify-center">
        <h1>탐색하기</h1>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="w-full h-full max-w-[1080px] mx-auto px-4">
        {/* 태그 필터 */}
        <TagFilter selectedTag={selectedTag} onTagChange={handleTagChange} />

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 게시글 목록 */}
        {filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onClick={() => handlePostClick(post.id)}
              />
            ))}

            {/* 무한스크롤 트리거 (전체 태그일 때만) */}
            {selectedTag === "전체" && hasNextPage && (
              <div ref={observerRef} className="flex justify-center py-8">
                {isLoading ? (
                  <div className="text-lg text-gray-500">
                    더 많은 게시글을 불러오는 중...
                  </div>
                ) : (
                  <div className="text-lg text-gray-400">
                    스크롤하여 더 보기
                  </div>
                )}
              </div>
            )}

            {/* 마지막 페이지 도달 시 */}
            {selectedTag === "전체" && !hasNextPage && posts.length > 0 && (
              <div className="flex justify-center py-8">
                <div className="text-lg text-gray-400">
                  모든 게시글을 불러왔습니다
                </div>
              </div>
            )}
          </>
        ) : (
          // 빈 상태
          <div className="flex flex-col items-center justify-center py-24">
            {isLoading ? (
              <div className="text-lg text-gray-500">
                게시글을 불러오는 중...
              </div>
            ) : (
              <>
                <div className="text-lg text-gray-500 mb-4">
                  {selectedTag === "전체"
                    ? "등록된 게시글이 없습니다."
                    : `'${selectedTag}' 태그의 게시글이 없습니다.`}
                </div>
                <button
                  onClick={() => navigate("/posts/new")}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  첫 번째 게시글 작성하기
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
