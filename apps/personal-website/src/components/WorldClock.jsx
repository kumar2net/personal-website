import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Clock = ({ timeZone, label, city }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("en-GB", options));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeZone]);

  return (
    <Paper
      variant="outlined"
      sx={(theme) => ({
        px: 2.5,
        py: 1.5,
        minWidth: 86,
        textAlign: "center",
        borderRadius: 3,
        borderColor: "divider",
        backgroundImage:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(2,6,23,0.75), rgba(15,23,42,0.55))"
            : "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.08))",
        color:
          theme.palette.mode === "dark"
            ? "#f8fafc"
            : theme.palette.text.primary,
      })}
    >
      <Typography
        variant="caption"
        sx={(theme) => ({
          fontWeight: 600,
          letterSpacing: 0.6,
          color:
            theme.palette.mode === "dark"
              ? "rgba(248,250,252,0.8)"
              : theme.palette.text.secondary,
        })}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: 700, mt: 0.5 }}
      >
        {time.substring(0, 5)}
      </Typography>
      <Typography
        variant="caption"
        sx={(theme) => ({
          fontWeight: 500,
          textTransform: "uppercase",
          color:
            theme.palette.mode === "dark"
              ? "rgba(248,250,252,0.7)"
              : theme.palette.text.secondary,
        })}
      >
        {city}
      </Typography>
    </Paper>
  );
};

const WorldClock = () => {
  const timeZones = [
    { label: "SGT", timeZone: "Asia/Singapore", city: "SIN" },
    { label: "IST", timeZone: "Asia/Kolkata", city: "MAA" },
    { label: "UTC", timeZone: "Etc/UTC", city: "LON" },
    { label: "EDT", timeZone: "America/New_York", city: "MCO" },
    { label: "PDT", timeZone: "America/Los_Angeles", city: "SFO" },
  ];

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.5, md: 2.5 }}
      justifyContent="center"
      alignItems="stretch"
      sx={{ mt: 8, flexWrap: "wrap" }}
    >
      {timeZones.map(({ label, timeZone, city }) => (
        <Clock key={label} label={label} timeZone={timeZone} city={city} />
      ))}
    </Stack>
  );
};

export default WorldClock;
