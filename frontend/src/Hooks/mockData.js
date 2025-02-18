const mockPosts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    image: "https://i.redd.it/v4g5cnfm3pk41.jpg",
    caption: `${i + 1} rule of Fight Club, you DO NOT talk about Fight Club.`,
    points: 0,
    username: "top__goon"
  }));
  
  export default mockPosts;
  