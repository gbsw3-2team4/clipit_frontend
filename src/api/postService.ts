// src/api/postService.ts
import axiosInstance from "./axios";

// 게시글 타입 정의 (API 명세서 + language 추가 예정)
export interface Post {
  id: string;
  title: string;
  description: string;
  code: string;
  language?: string; // 추가 예정 필드
  tags: string[];
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// 게시글 생성 요청 타입
export interface CreatePostRequest {
  title: string;
  description: string;
  code: string;
  tags: string[];
}

// 게시글 목록 조회 응답 타입
export interface PostsResponse {
  posts: Post[];
}

// 게시글 단일 조회 응답 타입
export interface PostResponse {
  post: Post;
}

// 게시글 삭제 응답 타입
export interface DeletePostResponse {
  message: string;
}

// 게시글 관련 서비스 클래스
class PostService {
  // 게시글 목록 조회 (전체)
  async fetchAllPosts(): Promise<Post[]> {
    const response = await axiosInstance.get<Post[]>("/posts");
    return Array.isArray(response.data) ? response.data : [];
  }

  // 게시글 목록 조회 (페이지네이션 시뮬레이션)
  async fetchPosts(page: number = 1, pageSize: number = 10): Promise<Post[]> {
    const response = await axiosInstance.get<Post[]>("/posts");
    const allPosts = Array.isArray(response.data) ? response.data : [];

    // 페이지네이션 처리
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allPosts.slice(startIndex, endIndex);
  }

  // 게시글 상세 조회
  async fetchPostById(id: string): Promise<Post> {
    const response = await axiosInstance.get<Post>(`/posts/${id}`);

    // 백엔드가 직접 Post 객체로 응답하는지 {post: Post} 구조인지 확인
    if (response.data && typeof response.data === "object") {
      // {post: {...}} 구조인 경우
      if ("post" in response.data) {
        return (response.data as any).post;
      }
      // 직접 Post 객체인 경우
      return response.data;
    }

    throw new Error("게시글 데이터가 올바르지 않습니다.");
  }

  // 게시글 생성
  async createPost(data: CreatePostRequest): Promise<Post> {
    const response = await axiosInstance.post<any>("/posts", data);

    // 백엔드 응답 구조 확인 후 적절히 처리
    if (response.data && typeof response.data === "object") {
      // {post: {...}} 구조인 경우
      if ("post" in response.data) {
        return response.data.post;
      }
      // 직접 Post 객체인 경우
      if ("id" in response.data) {
        return response.data;
      }
    }

    throw new Error("게시글 생성 응답이 올바르지 않습니다.");
  }

  // 특정 작성자의 게시글 조회
  async fetchPostsByAuthor(authorId: string): Promise<Post[]> {
    const response = await axiosInstance.get<PostsResponse>(
      `/posts/author/${authorId}`
    );
    return response.data.posts || [];
  }

  // 내가 작성한 게시글 조회 (현재 로그인한 사용자)
  async fetchMyPosts(): Promise<Post[]> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      return this.fetchPostsByAuthor(user.id);
    }
    return [];
  }

  // 게시글 수정
  async updatePost(
    id: string,
    data: Partial<CreatePostRequest>
  ): Promise<Post> {
    const response = await axiosInstance.put<PostResponse>(
      `/posts/${id}`,
      data
    );
    return response.data.post;
  }

  // 게시글 삭제
  async deletePost(id: string): Promise<DeletePostResponse> {
    const response = await axiosInstance.delete<DeletePostResponse>(
      `/posts/${id}`
    );
    return response.data;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const postService = new PostService();
export default postService;
