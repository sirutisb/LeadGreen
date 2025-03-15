import { Lock } from "lucide-react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Grow from "@mui/material/Grow"

export default function RewardCardLocked({ reward, getRewardIcon }) {
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
          background: "linear-gradient(90deg, #4b5563, #374151)",
          border: "none",
          filter: "grayscale(30%)",
          color: "#9ca3af",
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
            borderRadius: 1,
            fontWeight: "bold",
            mb: 1,
            px: 1.5,
            py: 0.5,
            fontSize: "0.875rem",
            borderColor: "#9ca3af",
          }}
        >
          Day {reward.day}
        </Box>

        {/* Icon & Amount with Lock Overlay */}
        <Box sx={{ display: "flex", alignItems: "center", my: 1, position: "relative" }}>
          <Box
            sx={{
              position: "relative",
              height: 40,
              width: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            {getRewardIcon(reward.reward)}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(0,0,0,0.6)",
                  backdropFilter: "blur(1px)",
                  borderRadius: "50%",
                  border: "2px solid #4b5563",
                }}
              />
              <Lock style={{ height: 20, width: 20, color: "white", zIndex: 10 }} />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
            x?
          </Typography>
        </Box>

        {/* Locked Button */}
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
            backgroundColor: "#4b5563",
            color: "#9ca3af",
            cursor: "not-allowed",
          }}
        >
          Locked
        </Button>

        {/* Border Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: 2,
            border: "2px solid #4b5563",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Grow>
  )
}
