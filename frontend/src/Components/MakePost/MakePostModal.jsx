import React, { useContext, useState } from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import QRScannerStep from "./QRScannerStep";
import ImageUploadStep from "./ImageUploadStep";
import CaptionStep from "./CaptionStep";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";
import axiosInstance from "../../Context/axiosInstance";

const MakePostModal = ({ open, onClose }) => {
  const [qrValue, setQrValue] = useState(""); // ✅ Store scanned QR value
  const [images, setImages] = useState([]); // ✅ Store selected image
  const [step, setStep] = useState(1); // ✅ Multi-step tracking

  // ✅ Handle Form Submission
  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please select an image!", { position: "top-right" });
      return;
    }

    const formData = new FormData();
    formData.append("caption", data.caption);
    formData.append("qr_code", qrValue || "");
    formData.append("image", images[0].file);

    try {
      const response = await axiosInstance.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // ✅ No need to manually add Authorization
      });

      console.log("Response Data:", response.data);

      if (response.status === 201) {
        toast.success("Post created successfully!", { position: "top-right" });
        setImages([]);
        setQrValue("");
        setStep(1);
        onClose();
      } else {
        toast.error("Failed to create post!", { position: "top-right" });
      }
    } catch (error) {
      console.error("Axios Error:", error.response?.data || error.message);
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
          <Typography variant="h6" color="black">Create Post</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {step === 1 && <QRScannerStep qrValue={qrValue} setQrValue={setQrValue} nextStep={() => setStep(2)} />}
        {step === 2 && <ImageUploadStep images={images} setImages={setImages} nextStep={() => setStep(3)} prevStep={() => setStep(1)} />}
        {step === 3 && <CaptionStep images={images} qrValue={qrValue} prevStep={() => setStep(2)} onSubmit={onSubmit} />}
      </Box>
    </Modal>
  );
};

export default MakePostModal;
