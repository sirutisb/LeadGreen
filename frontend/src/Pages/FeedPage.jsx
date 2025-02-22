import React from "react";
import Feed from "../Components/Feed/Feed";
import MakePost from "../Components/MakePost/MakePost";
import { Box } from "@mui/material";
import NavBar from "../Components/NavBar/NavBar";
import Page from "./Page";
import Footer from "../Components/Footer";

function FeedPage() {
  return (
    <Page className="relative">
      <div className="min-h-screen flex flex-col bg-[#F3F1EA]">
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
        <Footer/>
    </Page>

    
  );
}

export default FeedPage;
