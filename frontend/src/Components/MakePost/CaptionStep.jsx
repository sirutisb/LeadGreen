import React from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

// ✅ Validation Schema
const schema = yup.object().shape({
  caption: yup.string().required("Caption is required"),
});

const CaptionStep = ({ images, qrValue, prevStep, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="body1" fontWeight="bold" mb={1} color="black">
        Step 3: Add Caption & Post
      </Typography>

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

      {/* ✅ Buttons with space and animations */}
      <Stack direction="row" justifyContent="space-between" mt={3} spacing={2}>
        <Button
          variant="outlined"
          fullWidth
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
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#1B6630",
            color: "white",
            transition: "all 0.3s ease-in-out",
            "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" },
          }}
        >
          Submit Post
        </Button>
      </Stack>
    </form>
  );
};

export default CaptionStep;
