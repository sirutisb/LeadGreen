const mockPosts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Post Title ${i + 1}`,
    image: "https://images-ext-1.discordapp.net/external/Io1d-GSoaKDQlNHS3TPNSbf2m5muHBUv7RDMPaDenzw/https/image-cdn-ak.spotifycdn.com/image/ab67706c0000da841cd2ede58fc826fcc2c26b5f?format=webp&width=600&height=600",
    caption: `This is the body of post ${i + 1}. More content goes here.`,
    points: 0,
  }));
  
  export default mockPosts;
  