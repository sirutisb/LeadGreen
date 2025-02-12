import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Post = ({ post }) => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 500,
        mx: "auto",
        mt: 2,
        p: 2,
        border: "2px solid #1B6630",
        position: "relative", // Needed for positioning the points badge
        mb: 10
      }}
    >
      {/* Points Received (Top-Right Badge) */}
      <Box
        sx={{
          position: "absolute",
          top: 15,
          right: 15,
          width: 40,
          height: 40,
          backgroundColor: "#1B6630", // Dark green
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {post.points}
      </Box>

      {/* User Info */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: "#1B6630", width: 40, height: 40 }} />
        <Typography variant="h6" sx={{ ml: 2, color: "#1B6630", fontWeight: "bold" }}>
          top__goon
        </Typography>
      </Box>

      {/* Image */}
      <Box
        sx={{
          backgroundColor: "#DEFDE9", // Light green background
          borderRadius: 2,
          overflow: "hidden",
          mb: 1,
        }}
      >
        <img
          src={post.image}
          alt="Post"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </Box>

      {/* Caption */}
      <Typography variant="body1" sx={{ color: "#1B6630", fontWeight: "bold" }}>
        {post.caption}
      </Typography>
    </Box>
  );
};

export default Post;
