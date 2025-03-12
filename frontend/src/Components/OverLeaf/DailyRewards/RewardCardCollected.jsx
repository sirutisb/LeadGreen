import { Check } from "lucide-react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grow from "@mui/material/Grow"
import React from "react"

export default function RewardCardCollected({ reward, getRewardIcon }) {
  return (
    <Grow in={true} timeout={500}>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
          height: "100%",
          transition: "transform 0.3s ease",
          background: "#f3f4f6",
          border: "2px solid #86efac",
          filter: "none",
          color: "#374151",
          "&:hover": { transform: "scale(1.03)" },
        }}
      >
        {/* Check Icon */}
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            bgcolor: "#22c55e",
            borderRadius: "50%",
            p: 0.5,
            zIndex: 20,
            boxShadow: 2,
          }}
        >
          <Check style={{ height: 16, width: 16, color: "white" }} />
        </Box>

        {/* Day Label */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid",
            borderRadius: 1,
            fontWeight: "bold",
            mb: 1,
            px: 1.5,
            py: 0.5,
            fontSize: "0.875rem",
            borderColor: "#86efac",
          }}
        >
          Day {reward.day}
        </Box>

        {/* Icon & Amount */}
        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
          {/* Render larger icon without a circular container */}
          <Box sx={{ mr: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {React.cloneElement(getRewardIcon(reward.reward), { className: "w-8 h-8" })}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {reward.amount}
          </Typography>
        </Box>

        {/* Collected Button */}
        <Button
          disabled
          variant="contained"
          sx={{
            mt: "auto",
            width: "100%",
            fontSize: "0.875rem",
            px: 2,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            backgroundColor: "#a7f3d0",
            color: "#065f46",
            cursor: "default",
            "&:hover": { backgroundColor: "#a7f3d0" },
          }}
        >
          Collected
        </Button>
      </Box>
    </Grow>
  )
}
