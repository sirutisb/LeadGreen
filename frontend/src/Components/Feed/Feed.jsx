import { useState, useEffect } from "react";
import axiosInstance from "../../Context/axiosInstance";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Post from "./Post";
import LinearProgress from '@mui/material/LinearProgress';
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState("http://127.0.0.1:8000/api/posts/?page=1");
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false); // ✅ State for Back to Top button visibility

  const fetchNextPage = async () => {
    if (!nextPage || isFetchingNextPage) return;

    try {
      const response = await axiosInstance.get(nextPage);
      const data = response.data;

      setPosts((prev) => [...prev, ...data.results]);
      setNextPage(data.next);
      setHasNextPage(!!data.next);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  useEffect(() => {
    fetchNextPage();
  }, []);

  const observeLastElement = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, setIsFetchingNextPage, 800);

  // ✅ Handle Scroll Event to Show/Hide "Back to Top" Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Smooth Scroll to Top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="feed-container">
      {posts.map((post, index) => (
        <div ref={index === posts.length - 1 ? observeLastElement : null} key={index}>
          <Post post={post} />
        </div>
      ))}
      
      {isFetchingNextPage && <LinearProgress color="success" />}
      {!hasNextPage && <p className="text-black">No more posts</p>}

      {/* 🔥 Beautiful Floating "Back to Top" Button */}
      <Zoom in={showScrollTop}>
        <Fab 
          color="success" 
          size="medium" 
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#1B6630",
            "&:hover": { backgroundColor: "#145022" },
            transition: "0.3s ease-in-out",
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: 30, color: "white" }} />
        </Fab>
      </Zoom>
    </div>
  );
};

export default Feed;
