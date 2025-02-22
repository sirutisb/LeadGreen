import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import QrReader from "react-qr-scanner";
import { ArrowForward, Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";
import { toastError, toastInfo, toastSuccess } from "../utils/toastCustom";

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === "");

  const handleScan = (data) => {
    if (data) {
      setQrValue(data.text || data);
      setIsScanning(false);
      toastSuccess(`QR Code Scanned! ${data.text || data}`)
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    toastError("QR Scan Failed!")
  };

  const handleReset = () => {
    setQrValue("");
    setIsScanning(true);
    toastInfo("QR Code Reset!")
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        borderRadius: "12px",
        border: "2px solid #ccc",
        backgroundColor: "#FFF",
        width: { xs: "90%", sm: "70%", md: "60%" },
        mx: "auto",
      }}
    >
      <Typography
        variant="body1"
        fontWeight="bold"
        mb={2}
        color="black"
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
        Step 1: Scan QR Code
      </Typography>

      {isScanning ? (
        <Box
          sx={{
            width: { xs: "250px", sm: "300px", md: "320px" },
            height: { xs: "250px", sm: "300px", md: "320px" },
            mx: "auto",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <QrReader
            delay={100}
            style={{ width: "100%", height: "100%",objectFit: "cover"}}
            onError={handleError}
            onScan={handleScan}
          />
        </Box>
      ) : (
        <Typography
          variant="body2"
          mt={2}
          fontWeight="bold"
          color="black"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          ✅ Received from QR code: {qrValue}
        </Typography>
      )}

      {/* ✅ Buttons stay on the same row at all screen sizes */}
      {qrValue && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={3} width="100%">
          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "red",
              "&:hover": { bgcolor: "#ff4d4d", transform: "scale(1.05)" },
              transition: "all 0.3s ease-in-out",
            }}
            onClick={handleReset}
          >
            <Cancel sx={{ mr: 1 }} /> {/* ✅ Added margin-right for spacing */}
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "#1B6630",
              "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" },
              transition: "all 0.3s ease-in-out",
            }}
            onClick={nextStep}
          >
            Next
            <ArrowForward sx={{ ml: 1 }} /> {/* ✅ Added margin-left for spacing */}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default QRScannerStep;
