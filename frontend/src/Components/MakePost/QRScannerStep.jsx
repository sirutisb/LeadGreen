import React, { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import QrReader from "react-qr-scanner"; // ✅ Correct import
import { ArrowForward, Cancel } from "@mui/icons-material";
import { toast } from "react-toastify";

const QRScannerStep = ({ qrValue, setQrValue, nextStep }) => {
  const [isScanning, setIsScanning] = useState(qrValue === ""); // ✅ Only scan if there's no previous QR value

  const handleScan = (data) => {
    if (data) {
      setQrValue(data.text || data); // ✅ Stores QR code result
      setIsScanning(false); // ✅ Stops scanning after success
      toast.success(`QR Code Scanned! ${data.text || data}`, { position: "top-right" });
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
    toast.error("QR Scan Failed!", { position: "top-right" });
  };

  const handleReset = () => {
    setQrValue("");
    setIsScanning(true); // ✅ Allow scanning again
    toast.info("QR Code Reset!", { position: "top-right" });
  };

  return (
    <Box sx={{ textAlign: "center", p: 3, borderRadius: "8px", border: "1px solid #ccc", backgroundColor: "#FFF" }}>
      <Typography variant="body1" fontWeight="bold" mb={2} color="black">
        Step 1: Scan QR Code
      </Typography>

      {isScanning ? (
        <QrReader
          delay={100} // ✅ Adjusted scanning delay
          style={{ width: "100%", maxHeight: "250px", borderRadius: "8px" }}
          onError={handleError}
          onScan={handleScan}
        />
      ) : (
        <Typography variant="body2" mt={2} fontWeight="bold" color="black">
          ✅ Received from QR code: {qrValue}
        </Typography>
      )}

      {qrValue && (
        <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "red",
              "&:hover": { bgcolor: "#ff4d4d", transform: "scale(1.05)" },
              transition: "all 0.3s ease-in-out",
            }}
            startIcon={<Cancel />}
            onClick={handleReset}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#1B6630", "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" }, transition: "all 0.3s ease-in-out" }}
            endIcon={<ArrowForward />}
            onClick={nextStep}
          >
            Next
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default QRScannerStep;
