import mockPosts from "./MockData";

const ITEMS_PER_PAGE = 10;

const fetchPosts = async ({ pageParam = 1 }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const posts = mockPosts.slice(start, end);
      
      resolve({
        posts,
        nextPage: end < mockPosts.length ? pageParam + 1 : null, // Null means no more pages
      });
    }, 500); // Simulates network delay
  });
};

export { fetchPosts };
