import React from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


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
      <Typography 
        variant="body1" 
        fontWeight="bold" 
        mb={1} 
        color="black"
        sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
      >
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
        rows={3}
        sx={{
          fontSize: { xs: "0.9rem", sm: "1rem" },
          "& .MuiInputBase-root": { borderRadius: "12px" },
        }}
      />

      <Stack 
        direction="row" 
        spacing={2} 
        mt={3} 
        sx={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            flex: 1,
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
          type="submit"
          variant="contained"
          sx={{
            flex: 1,
            bgcolor: "#1B6630",
            color: "white",
            transition: "all 0.3s ease-in-out",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            "&:hover": { bgcolor: "#155724", transform: "scale(1.05)" },
          }}
          endIcon={<Send />}
        >
          Post
        </Button>
      </Stack>
    </form>
  );
};

export default CaptionStep;
