import React, { useState } from "react";
import { Modal, Box, IconButton, Typography, Slide, Zoom } from "@mui/material";
import { Close } from "@mui/icons-material";
import QRScannerStep from "./QRScannerStep";
import ImageUploadStep from "./ImageUploadStep";
import CaptionStep from "./CaptionStep";
import { toast } from "react-toastify";
import axiosInstance from "../../Context/axiosInstance";
import { toastError, toastSuccess } from "../utils/toastCustom";

const MakePostModal = ({ open, onClose }) => {
  const [qrValue, setQrValue] = useState("");
  const [images, setImages] = useState([]);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("left");

  // ✅ Handles forward navigation
  const handleNextStep = () => {
    setDirection("left");
    setStep((prev) => prev + 1);
  };

  // ✅ Handles backward navigation
  const handlePrevStep = () => {
    setDirection("right");
    setStep((prev) => prev - 1);
  };

  // ✅ Handles post submission
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toastError("Please select an image!")
      return;
    }

    const formData = new FormData();
    formData.append("caption", data.caption);
    formData.append("qr_code", qrValue || "");
    formData.append("image", images[0].file);

    try {
      const response = await axiosInstance.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toastSuccess("Post created successfully!")
        setImages([]);
        setQrValue("");
        setStep(1);
        onClose();
      } else {
        toastError("Failed to create post!")
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
      toastError("Error! Please try again.")
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {/* ✅ Move Zoom Outside to Prevent Layout Shift */}
      <Zoom in={open} timeout={300}>
        <Box
          sx={{
            // position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: "500px",
            bgcolor: "white",
            boxShadow: 24,
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            outline: "none",
            overflow: "hidden", // ✅ Ensures only one step is visible
          }}
        >
          {/* 🔥 Modal Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography
              variant="h6"
              sx={{
                color: "black",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              Post Your Achievement!
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          {/* 🔥 Step Transitions (Only One Step Visible) */}
          <Box sx={{ position: "relative", minHeight: "200px", overflow: "hidden" }}>
            {step === 1 && (
              <Slide direction={direction} in={step === 1} mountOnEnter unmountOnExit>
                <Box>
                  <QRScannerStep qrValue={qrValue} setQrValue={setQrValue} nextStep={handleNextStep} />
                </Box>
              </Slide>
            )}
            {step === 2 && (
              <Slide direction={direction} in={step === 2} mountOnEnter unmountOnExit>
                <Box>
                  <ImageUploadStep images={images} setImages={setImages} nextStep={handleNextStep} prevStep={handlePrevStep} />
                </Box>
              </Slide>
            )}
            {step === 3 && (
              <Slide direction={direction} in={step === 3} mountOnEnter unmountOnExit>
                <Box>
                  <CaptionStep images={images} qrValue={qrValue} prevStep={handlePrevStep} onSubmit={onSubmit} />
                </Box>
              </Slide>
            )}
          </Box>
        </Box>
      </Zoom>
    </Modal>
  );
};

export default MakePostModal;
