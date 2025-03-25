
import { Switch, styled } from "@mui/material";

const Toggle = styled(Switch)(({ theme }) => ({
    width: 173,
    height: 52,
    padding: 0,
    display: "flex",
    alignItems: "center",
    "& .MuiSwitch-switchBase": {
      padding: 6,
      top: "50%",
      transform: "translateY(-50%)",
      "&.Mui-checked": {
        transform: "translateX(121px) translateY(-50%)", // Moves fully across
        "& + .MuiSwitch-track": {
          backgroundColor: "#A15B96", // Filled color when checked
          borderColor: "#A15B96",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      width: 40,
      height: 40,
      backgroundColor: "#A15B96",
      transition: "transform 0.3s ease",
    },
    "& .MuiSwitch-track": {
      width: "100%",
      height: "100%",
      borderRadius: 40,
      border: "4px solid #A15B96",
      backgroundColor: "transparent",
      opacity: 1,
      boxSizing: "border-box",
    },
  }));


export default Toggle