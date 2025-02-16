import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { CloudUpload, ArrowForward, ArrowBack, Delete } from "@mui/icons-material";
import ImageUploading from "react-images-uploading";

const ImageUploadStep = ({ images, setImages, nextStep, prevStep }) => {
  const onImageChange = (imageList) => {
    setImages(imageList);
  };

  return (
    <>
      <Typography variant="body1" fontWeight="bold" mb={1} color="black">
        Step 2: Upload Image
      </Typography>

      <ImageUploading value={images} onChange={onImageChange} maxNumber={1} dataURLKey="data_url" acceptType={["jpg", "png", "jpeg"]}>
        {({ imageList, onImageUpload, onImageRemove }) => (
          <>
            {/* ✅ Clickable Drop Zone (Square & Responsive) */}
            <Box
              onClick={onImageUpload}
              sx={{
                mt: 2,
                width: "320px", // Square size
                height: "320px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                border: "2px dashed #aaa",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                "&:hover": { borderColor: "#555", backgroundColor: "#eee" },
                position: "relative",
              }}
            >
              {imageList.length === 0 ? (
                <Box textAlign="center">
                  <CloudUpload sx={{ fontSize: 40, color: "#888" }} />
                  <Typography variant="body2" color="gray" fontWeight="bold">
                    Click to Upload
                  </Typography>
                </Box>
              ) : (
                <img
                  src={imageList[0].data_url}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              )}

              {/* ✅ Remove button (only if image is selected) */}
              {imageList.length > 0 && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents triggering upload click
                    onImageRemove(0);
                  }}
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    minWidth: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    bgcolor: "red",
                    color: "white",
                    "&:hover": { bgcolor: "darkred" },
                  }}
                >
                  <Delete fontSize="small" />
                </Button>
              )}
            </Box>
          </>
        )}
      </ImageUploading>

      {/* ✅ Buttons with space and animations */}
      <Stack direction="row" justifyContent="space-between" mt={3} width="100%">
        <Button
          variant="outlined"
          sx={{
            transition: "all 0.3s ease-in-out",
            "&:hover": { bgcolor: "#ddd", transform: "scale(1.05)" },
          }}
          startIcon={<ArrowBack />}
          onClick={prevStep}
        >
          Back
        </Button>

        <Button
          variant="contained"
          sx={{
            bgcolor: images.length > 0 ? "#1B6630" : "#ccc",
            color: "white",
            transition: "all 0.3s ease-in-out",
            "&:hover": images.length > 0 ? { bgcolor: "#155724", transform: "scale(1.05)" } : {},
          }}
          disabled={images.length === 0}
          endIcon={<ArrowForward />}
          onClick={nextStep}
        >
          Next
        </Button>
      </Stack>
    </>
  );
};

export default ImageUploadStep;
