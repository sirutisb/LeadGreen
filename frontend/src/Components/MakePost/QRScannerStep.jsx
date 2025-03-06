import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import QrReader from "react-qr-scanner";
import { ArrowForward, Cancel } from "@mui/icons-material";
import { toastError, toastInfo, toastSuccess } from "../utils/toastCustom";
import axiosInstance from "../../Context/axiosInstance"; // Import Axios instance

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === "");
  const [loading, setLoading] = useState(false);

  const validateQRCode = async (scannedCode) => {
    try {
      setLoading(true);
      console.log({ qr_code: scannedCode })
      const response = await axiosInstance.get("qrcodes/",{params: { qr_code: scannedCode }});

      if (response.data.exists) {
        setQrValue(scannedCode);
        setIsScanning(false);
        toastSuccess(`✅ QR Code Verified: ${scannedCode}`);
      } else {
        toastError("❌ Invalid QR Code! Please scan again.");
        setIsScanning(true);
      }
    } catch (error) {
      console.error("QR Code Validation Error:", error);
      toastError("❌ QR Validation Failed! Try again.");
      setIsScanning(true);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (data) => {
    if (data) {
      const scannedCode = data.text || data;
      validateQRCode(scannedCode);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    toastError("QR Scan Failed!");
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
            <QrReader
              delay={100}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={handleError}
              onScan={handleScan}
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
