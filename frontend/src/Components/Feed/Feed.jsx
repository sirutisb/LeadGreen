import { useState, useEffect } from "react";
import axiosInstance from "../../Context/axiosInstance"; // ✅ Use axios instance
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Post from "./Post";

const FeedPage = () => {
  const [posts, setPosts] = useState([]); // ✅ Store posts
  const [nextPage, setNextPage] = useState("http://127.0.0.1:8000/api/posts/?page=1"); // ✅ Track next page
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  // ✅ Fetch Posts Function
  const fetchNextPage = async () => {
    if (!nextPage || isFetchingNextPage) return; // Stop if no more pages

    setIsFetchingNextPage(true);
    try {
      const response = await axiosInstance.get(nextPage);
      const data = response.data;

      setPosts((prev) => [...prev, ...data.results]); // ✅ Append new posts
      setNextPage(data.next); // ✅ Update next page URL
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchNextPage(); // ✅ Fetch initial posts
  }, []);

  // ✅ Infinite Scroll Hook (Triggers fetchNextPage)
  const observerRef = useInfiniteScroll(fetchNextPage, !!nextPage, isFetchingNextPage);

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default FeedPage;
