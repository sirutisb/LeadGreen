import DailyRewardsHeader from "./DailyRewardsHeader"
import RewardGrid from "./RewardGrid"
import Modal from "@mui/material/Modal"
import Fade from "@mui/material/Fade"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  p: 6,
  borderRadius: "8px",
  boxShadow: 24,
  maxWidth: "500px",
  width: "90%",
}

export default function DailyRewardsModal({ open, rewards, streak, collectReward, getRewardIcon, renderStreakFlames, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: { enter: 500, exit: 700 },
        style: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <Fade in={open} timeout={{ enter: 500, exit: 700 }}>
        <Box sx={modalStyle}>
          <DailyRewardsHeader streak={streak} renderStreakFlames={renderStreakFlames} />
          <RewardGrid rewards={rewards} collectReward={collectReward} getRewardIcon={getRewardIcon} />
        </Box>
      </Fade>
    </Modal>
  )
}
