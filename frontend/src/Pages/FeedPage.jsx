import React, { useContext } from "react";
import Feed from "../Components/Feed/Feed";
import MakePost from "../Components/MakePost/MakePost";
import { Box } from "@mui/material";
import NavBar from "../Components/NavBar/NavBar";
import Page from "./Page";
import Footer from "../Components/Footer";
import AuthContext from "../Context/AuthContext";

function FeedPage() {
    const {user} = useContext(AuthContext)
    console.log(user)
  return (
    <Page className="relative bg-white">
      <NavBar />
      <div className="min-h-screen flex flex-col bg-white">
          <Box
          sx={{
              width: "100%",
              minHeight: "100vh", 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              paddingTop: "20px",
          }}
          >

          {/* Create Post Button */}
          {user && <MakePost />}

          {/* Feed Section */}
          <Box
              sx={{
              width: "100%",
              maxWidth: "600px", 
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
