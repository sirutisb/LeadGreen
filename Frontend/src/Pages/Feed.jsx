import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPosts } from "../Hooks/api";
import Post from "../Components/Post";
import useInfiniteScroll from "../Hooks/useInfiniteScroll";

const Feed = () => {
    //aa
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage ? lastPage.nextPage : undefined,
  });

  console.log(useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage ? lastPage.nextPage : undefined,
  }))

  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  if (status === "loading") return <p>Loading posts...</p>;
  if (status === "error") return <p>Error loading posts</p>;
  return (
    <div className="max-w-lg mx-auto">
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
    </div>
  );
};

export default Feed;
