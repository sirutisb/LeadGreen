import React from "react";
import Feed from "../Components/Feed/Feed";
import MakePost from "../Components/MakePost/MakePost";
import { Box } from "@mui/material";
import NavBar from "../Components/NavBar/NavBar";

function FeedPage() {
  return (
    <div className="pt-20 bg-[#DEFDE9]">
        <Box
        sx={{
            width: "100%",
            minHeight: "100vh", // Full screen height
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            paddingTop: "20px",
        }}
        >
        <NavBar />
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

    </div>
  );
}

export default FeedPage;
