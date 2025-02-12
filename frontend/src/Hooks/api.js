import mockPosts from "./mockData";

const ITEMS_PER_PAGE = 10;

const fetchPosts = async ({ pageParam = 1 }) => {
  console.log(`Fetching page: ${pageParam}`); // Debugging

  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const posts = mockPosts.slice(start, end);
      
      resolve({
        posts, // Ensure this is an array
        nextPage: end < mockPosts.length ? pageParam + 1 : undefined,
      });
    }, 500);
  });
};

export { fetchPosts };
