import { useState, useEffect } from "react";
import axiosInstance from "../../Context/axiosInstance";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import Post from "./Post";
import LinearProgress from '@mui/material/LinearProgress';
import { Fab, Zoom, Box } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState("http://127.0.0.1:8000/api/posts/?page=1");
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        maxWidth: "900px", // ✅ Keeps it centered on desktop
        mx: "auto",
        p: { xs: 3, sm: 2, md: 4 }, // ✅ Adjust padding (1px for mobile, 2px for tablets, 4px for desktops)
      }}
    >
      {posts.map((post, index) => (
        <Box
          ref={index === posts.length - 1 ? observeLastElement : null}
          key={index}
          sx={{
            mb: { xs: 2, md: 4 }, // ✅ Smaller margin between posts on mobile, normal on desktop
          }}
        >
          <Post post={post} />
        </Box>
      ))}

      {isFetchingNextPage && <LinearProgress color="success" />}
      {/* {!hasNextPage && <p className="text-black">No more posts</p>} */}

      {/* 🔥 Floating "Back to Top" Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="success"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "#1B6630",
            padding: { xs: "10px 14px", md: "12px 20px" }, // ✅ Adjust padding for mobile
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "2px 4px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#145022" },
            transition: "0.3s ease-in-out",
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: { xs: 24, md: 30 }, color: "white" }} />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default Feed;
