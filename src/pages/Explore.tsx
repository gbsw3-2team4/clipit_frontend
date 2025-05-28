import PostCard from "../components/post/PostCard";
import { mockPosts } from "../data/mockPosts";
import TagFilter from "../components/post/TagFilter";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="h-36 bg-[var(--bg-sub-color)] mt-15 flex items-center justify-center">
        <h1>탐색하기</h1>
      </div>
      <main className="w-full h-full max-w-[1080px] mx-auto">
        <TagFilter />
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            onClick={() => navigate(`/posts/${post.id}`)}
          />
        ))}
      </main>
    </div>
  );
};

export default Explore;
