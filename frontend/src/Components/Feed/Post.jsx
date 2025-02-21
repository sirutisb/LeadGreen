import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const Post = ({ post }) => {
    console.log(post)
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
        position: "relative",
        mb: 5, // Adjusted margin-bottom for spacing
      }}
    >
      {/* 🏆 Points Received (Top-Right Badge) */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 40,
          height: 40,
          backgroundColor: post.points_received > 0 ? "#1B6630" : "#bbb",
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
        {post.points_received}
      </Box>

      {/* 👤 User Info */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          src={post.user.profile_picture} // ✅ Uses profile picture if available
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#1B6630",
          }}
        />
        <Typography
          variant="h6"
          sx={{ ml: 2, color: "#1B6630", fontWeight: "bold" }}
        >
          {post.user.username}
        </Typography>
      </Box>

      {/* 🖼️ Image */}
      <Box
        sx={{
          backgroundColor: "#DEFDE9",
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

      {/* 📝 Caption */}
      <Typography
        variant="body1"
        sx={{ color: "#1B6630", fontWeight: "bold", mt: 1 }}
      >
        {post.caption}
      </Typography>
    </Box>
  );
};

export default Post;
