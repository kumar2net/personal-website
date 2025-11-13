import MuiCard from "@mui/material/Card";
import MuiCardContent from "@mui/material/CardContent";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export function Card({ sx, children, ...props }) {
  return (
    <MuiCard
      variant="outlined"
      {...props}
      sx={[
        (theme) => ({
          borderRadius: 3,
          borderColor: "divider",
          backgroundImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))"
              : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95))",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 30px rgba(2,6,23,0.7)"
              : "0 18px 34px rgba(15,23,42,0.08)",
        }),
        ...toArray(sx),
      ]}
    >
      {children}
    </MuiCard>
  );
}

export function CardContent({ sx, children, ...props }) {
  return (
    <MuiCardContent
      {...props}
      sx={[
        {
          lineHeight: 1.7,
        },
        ...toArray(sx),
      ]}
    >
      {children}
    </MuiCardContent>
  );
}
