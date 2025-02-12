import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";

// Validation Schema
const schema = yup.object().shape({
  caption: yup.string().required("Caption is required"),
});

const MakePostModal = ({ open, onClose }) => {
  const [images, setImages] = useState([]); // Store selected image

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle Image Upload
  const onImageChange = (imageList) => {
    setImages(imageList);
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please select an image!", { position: "top-right" });
      return;
    }

    console.log("Submitting data:", data);

    const formData = new FormData();
    formData.append("userId", 0); // Set default user ID
    formData.append("caption", data.caption);
    formData.append("qrcode", ""); // Empty QR Code
    formData.append("image", images[0].file); // Get the selected image

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        toast.success("Post created successfully!", { position: "top-right" });
        console.log("Server Response:", responseData);
        reset();
        setImages([]);
        onClose();
      } else {
        toast.error("Failed to create post!", { position: "top-right" });
        console.error("Server Error:", responseData);
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network error! Please try again.", { position: "top-right" });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "white",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Create Post</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Caption"
            {...register("caption")}
            error={!!errors.caption}
            helperText={errors.caption?.message}
            margin="normal"
            multiline
            rows={2}
          />

          {/* Image Uploading Section */}
          <ImageUploading
            value={images}
            onChange={onImageChange}
            maxNumber={1} // Limit to one image
            dataURLKey="data_url"
            acceptType={["jpg", "png", "jpeg"]}
          >
            {({ imageList, onImageUpload, onImageRemove }) => (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUpload />}
                  sx={{ mt: 2 }}
                  onClick={onImageUpload}
                >
                  Select Image
                </Button>

                {/* Image Preview */}
                {imageList.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      mt: 2,
                      textAlign: "center",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      backgroundColor: "#DEFDE9", // Light green
                    }}
                  >
                    <img
                      src={image.data_url}
                      alt="Preview"
                      style={{ width: "100%", borderRadius: "8px", marginTop: "5px" }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => onImageRemove(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </>
            )}
          </ImageUploading>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, bgcolor: "#1B6630" }}>
            Submit Post
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default MakePostModal;
