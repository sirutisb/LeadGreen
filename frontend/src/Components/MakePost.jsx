import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import MakePostModal from "./MakePostModal";

const MakePost = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#1B6630", // Dark Green
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          borderRadius: "20px",
          padding: "10px 20px",
          textTransform: "none",
          boxShadow: "2px 4px 8px rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "#DEFDE9", // Light Green on hover
            color: "#1B6630", // Dark Green text on hover
          },
        }}
      >
        + Create Post
      </Button>

      <MakePostModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default MakePost;
