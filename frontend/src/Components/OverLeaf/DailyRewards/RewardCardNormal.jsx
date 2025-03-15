import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grow from "@mui/material/Grow"
import React from "react"

export default function RewardCardNormal({ reward, collectReward, getRewardIcon }) {
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
          background: "linear-gradient(90deg, #008236, #00A53D)",
          border: "none",
          filter: "none",
          color: "#ffffff",
          "&:hover": { transform: "scale(1.03)" },
        }}
      >
        {/* Day Label */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid",
            borderRadius: 1, // minimal rounding
            fontWeight: "bold",
            mb: 1,
            px: 1.5,
            py: 0.5,
            fontSize: "0.875rem",
            borderColor: "#ffffff",
          }}
        >
          Day {reward.day}
        </Box>

        {/* Icon & Amount */}
        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
          {/* Render larger icon without the circular container */}
          <Box sx={{ mr: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {React.cloneElement(getRewardIcon(reward.reward), { className: "w-8 h-8" })}
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {reward.amount}
          </Typography>
        </Box>

        {/* Collect Button with click animation */}
        <Button
          onClick={() => collectReward(reward.day)}
          variant="contained"
          sx={{
            mt: "auto",
            width: "100%",
            fontSize: "0.875rem",
            px: 2,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            transition: "transform 0.2s",
            backgroundColor: "#ffffff",
            color: "#008236",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.9)",
              transform: "scale(1.02)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Collect
        </Button>
      </Box>
    </Grow>
  )
}
