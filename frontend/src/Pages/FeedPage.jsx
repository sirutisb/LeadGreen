import React from "react";
import Feed from "../Components/Feed";
import MakePost from "../Components/MakePost";
import { Box } from "@mui/material";

function FeedPage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh", // Full screen height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        paddingTop: "20px",
        backgroundColor: "#DEFDE9", // Light green background
      }}
    >
      {/* Create Post Button */}
      <MakePost />

      {/* Feed Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "600px", // Keeps feed compact
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: "10px",
        }}
      >
        <Feed />
      </Box>
    </Box>
  );
}

export default FeedPage;
