const mockPosts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Post Title ${i + 1}`,
    body: `This is the body of post ${i + 1}. More content goes here.`,
  }));
  
  export default mockPosts;
  