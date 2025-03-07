import React, { useState } from "react";
import { Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import { Scanner } from '@yudiel/react-qr-scanner';
import { ArrowForward, Cancel, QrCodeScanner } from "@mui/icons-material";
import { toastError, toastInfo, toastSuccess } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance";

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === "");
  const [isValidating, setIsValidating] = useState(false);
  
  // Validate QR code with the server
  const validateQRCode = async (scannedCode) => {
    try {
      const response = await axiosInstance.get("qrcodes/", {
        params: { qr_code: scannedCode }
      });
      return response.data.exists;
    } catch (error) {
      console.error('Error validating QR code:', error);
      return false;
    }
  };

  // Handle when a QR code is detected
  const handleScan = async (detectedCodes) => {
    // Ignore if already validating or no codes detected
    if (isValidating || !detectedCodes || detectedCodes.length === 0) {
      return;
    }
    const code = detectedCodes[0].rawValue;
    
    // Start validation
    setIsValidating(true);
    toastInfo('🔃 Validating QR code...');
    
    try {
      // Validate the QR code
      const isValid = await validateQRCode(code);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (isValid) {
        setQrValue(code);
        setIsScanning(false);
        toastSuccess(`✅ QR Code Verified: ${code}`);
      } else {
        toastError(`❌ QR Code Invalid: "${code}". Please scan again.`);
      }
    } catch (error) {
      toastError('Error during validation. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  // Handle scanner errors
  const handleError = (error) => {
    console.error('Scanner error:', error);
    toastError('Error accessing camera. Please check permissions.');
  };

  // Reset the scanner
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

      {/* Scanner or success view */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
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
            <Scanner
              onScan={handleScan}
              onError={handleError}
              scanDelay={500}
              paused={isValidating}
            />
            
            {/* Overlay during validation */}
            {isValidating && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <CircularProgress color="inherit" size={60} />
                <Typography sx={{ mt: 2 }}>Validating...</Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              width: { xs: "250px", sm: "300px", md: "320px" },
              height: { xs: "250px", sm: "300px", md: "320px" },
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <QrCodeScanner sx={{ fontSize: 64, color: "green", mb: 2 }} />
            <Typography
              variant="body2"
              fontWeight="bold"
              color="black"
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              ✅ Verified QR Code:
            </Typography>
            <Typography
              variant="body2"
              mt={1}
              color="black"
              sx={{ 
                fontSize: { xs: "0.9rem", sm: "1rem" },
                maxWidth: "90%",
                wordBreak: "break-all" 
              }}
            >
              {qrValue}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Action buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={3} width="100%">
        {qrValue && (
          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "red",
              "&:hover": { bgcolor: "#ff4d4d", transform: "scale(1.05)" },
              transition: "all 0.3s ease-in-out",
            }}
            onClick={handleReset}
            disabled={isValidating}
          >
            <Cancel sx={{ mr: 1 }} />
            Reset
          </Button>
        )}

        <Button
          variant="contained"
          sx={{
            flex: 1,
            bgcolor: "#1B6630",
            "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" },
            transition: "all 0.3s ease-in-out",
          }}
          onClick={qrValue ? nextStep : handleReset}
          disabled={isValidating || !qrValue}
        >
          {isValidating ? (
            <>Validating...</>
          ) : qrValue ? (
            <>
              Next
              <ArrowForward sx={{ ml: 1 }} />
            </>
          ) : (
            <>Scan QR Code</>
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default QRScannerStep;