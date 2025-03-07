import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
//import QrReader from "react-qr-scanner";
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowForward, Cancel } from "@mui/icons-material";
import { toastError, toastInfo, toastSuccess } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance"; // Import Axios instance

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === "");
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const validateQRCode = async (scannedCode) => {
    try {
      const response = await axiosInstance.get("qrcodes/", {params: { qr_code: scannedCode }});
      return response.data.exists;
    } catch (error) {
      console.error('Error validating QR code:', error);
      return false;
    }
  };

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const code = detectedCodes[0].rawValue; // Get the QR code value

      setLoading(true);
      setIsPaused(true);
      toastInfo('🔃 Validating QR code...');
      const isValid = await validateQRCode(code);
      setQrValue(code); // temporarily set the QR code value (need to validate it)

      // sleep to simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (isValid) {
        toastSuccess(`✅ QR Code Verified: ${code}`);
        setIsScanning(false);
      } else {
        toastError(`❌ QR Code Invalid: "${code}". Please scan again.`);
        setQrValue("");
      }

      setLoading(false);
      setIsPaused(false);
    }
  };

  // Callback for handling errors (e.g., camera access issues)
  const handleError = (error) => {
    console.error('Scanner error:', error);
    toastError('Error accessing camera. Please check permissions.');
  };

  const handleReset = () => {
    setQrValue("");
    setIsScanning(true);
    toastInfo("QR Code Reset!");
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        borderRadius: "12px",
        border: "2px solid #ccc",
        backgroundColor: "#FFF",
        width: { xs: "90%", sm: "80%", md: "100%" },
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
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
            {/* <QrReader
              delay={100}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={handleError}
              onScan={handleScan}
            /> */}

          {/* new scanner code */}
          <Scanner
          onScan={handleScan}
          onError={handleError}
          scanDelay={500}
          paused={isPaused}
          // styles={{
          //   container: { width: '300px', margin: '0 auto' }, // Optional: Customize the scanner size
          // }}
          />

          </Box>
        </Box>
      ) : (
        <Typography
          variant="body2"
          mt={2}
          fontWeight="bold"
          color="black"
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        >
          ✅ Verified QR Code: {qrValue}
        </Typography>
      )}

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
            <Cancel sx={{ mr: 1 }} />
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
            disabled={loading}
          >
            {loading ? "Validating..." : "Next"}
            <ArrowForward sx={{ ml: 1 }} />
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default QRScannerStep;
