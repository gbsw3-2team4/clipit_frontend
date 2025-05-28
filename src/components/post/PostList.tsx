// import { useInfinitePosts } from "../hooks/useInfinitePosts";
// import PostCard from "./PostCard";

// const PostList = () => {
//   const { data, fetchNextPage, hasNextPage, isLoading } = useInfinitePosts();

//   return (
//     <div>
//       {data.map((post) => (
//         <PostCard key={post.id} {...post} />
//       ))}
//       {hasNextPage && !isLoading && (
//         <div ref={fetchNextPage} style={{ height: 1 }} />
//       )}
//     </div>
//   );
// };

// export default PostList;
