import { useState, useEffect } from "react";
import axiosInstance from "../../Context/axiosInstance"; // ✅ Use axios instance
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

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
      {posts.map((post, index) => (
        <div key={post.id} className="post">
          <img src={post.image} alt="Post" className="post-image" />
          <p>{post.caption}</p>
          <span>By {post.user.username}</span>

          {/* ✅ Attach Observer to Last Post */}
          {index === posts.length - 1 && <div ref={observerRef} />}
        </div>
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default FeedPage;
