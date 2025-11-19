import { Chip, alpha } from "@mui/material";

export function Badge({ className = '', children, ...props }) {
  return (
    <Chip
      label={children}
      size="small"
      sx={(theme) => ({
        fontWeight: 600,
        borderRadius: 1.5,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: "primary.main",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        ...props.sx
      })}
      {...props}
    />
  );
}
