import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Moon, SunMedium } from "lucide-react";
import { useColorMode } from "../providers/ColorModeProvider";

type ModeToggleProps = {
  className?: string;
};

export default function ModeToggle({ className }: ModeToggleProps) {
  const { mode, toggleColorMode } = useColorMode();
  const isDark = mode === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        aria-pressed={isDark}
        onClick={toggleColorMode}
        size="small"
        className={className}
        sx={{
          borderRadius: "999px",
          border: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          transition:
            "background-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            backgroundColor: "action.hover",
            transform: "translateY(-1px)",
            boxShadow: "0 12px 20px rgba(15,23,42,0.18)",
          },
          "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 6px 12px rgba(15,23,42,0.2)",
          },
        }}
      >
        {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
      </IconButton>
    </Tooltip>
  );
}

