import React, { useState } from "react";
import { Fab, Zoom } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import MakePostModal from "./MakePostModal";

const MakePost = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  return (
    <>
      {/* 🔥 Floating "Create Post" Button */}
      <Zoom in={visible}>
        <Fab
          color="success"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20,
            backgroundColor: "#1B6630", // Dark Green
            color: "white",
            transition: "0.3s ease-in-out",
            boxShadow: "3px 5px 10px rgba(0, 0, 0, 0.3)",
            "&:hover": {
              backgroundColor: "#DEFDE9", // Light Green
              color: "#1B6630",
              transform: "scale(1.1)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <AddPhotoAlternateIcon sx={{ fontSize: 30 }} />
        </Fab>
      </Zoom>

      {/* Modal for Creating a Post */}
      <MakePostModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default MakePost;
