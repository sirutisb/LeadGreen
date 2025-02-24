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
      <Typography 
        variant="body1" 
        fontWeight="bold" 
        mb={1} 
        color="black"
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
        Step 2: Upload Image
      </Typography>

      <ImageUploading value={images} onChange={onImageChange} maxNumber={1} dataURLKey="data_url" acceptType={["jpg", "png", "jpeg"]}>
        {({ imageList, onImageUpload, onImageRemove }) => (
          <div className="p-3">

            <Box
              onClick={onImageUpload}
              sx={{
                mt: 2,
                width: { xs: "100%", sm: "320px" },
                height: { xs: "250px", sm: "320px" },
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
                mx: "auto",
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


              {imageList.length > 0 && (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onImageRemove(0);
    }}
    sx={{
      position: "absolute",
      top: "-12px",
      right: "-12px",
      width: "36px",
      height: "36px",
      minWidth: "unset",
      borderRadius: "50%",
      bgcolor: "red",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      border: "3px solid white",
      boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
      "&:hover": { bgcolor: "darkred", transform: "scale(1.1)" },
    }}
  >
    <Delete fontSize="small" />
  </Button>
)}


            </Box>
          </div>
        )}
      </ImageUploading>

      <Stack 
        direction="row" 
        justifyContent="space-between" 
        mt={3} 
        width="100%"
        sx={{ flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", sm: "space-between" } }} // Centered on mobile
      >
        <Button
          variant="outlined"
          sx={{
            transition: "all 0.3s ease-in-out",
            fontSize: { xs: "0.9rem", sm: "1rem" },
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
            fontSize: { xs: "0.9rem", sm: "1rem" },
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
