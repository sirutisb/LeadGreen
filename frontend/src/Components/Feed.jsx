import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../Hooks/api";
import Post from "./Post";
import useInfiniteScroll from "../Hooks/useInfiniteScroll";

const Feed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchPosts({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div className="max-w-lg w-full">
      {status === "loading" && <p>Loading posts...</p>}
      {status === "error" && <p>Error loading posts</p>}
      
      {status === "success" && (
        <>
          {data.pages.map((group, index) => (
            <div key={index}>
              {group.posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ))}
          <div ref={observerRef} className="h-10 w-full flex justify-center items-center">
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default Feed;