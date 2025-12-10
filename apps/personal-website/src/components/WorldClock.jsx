import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useColorMode } from "../providers/ColorModeProvider";

const Clock = ({ timeZone, label, city, isDarkMode }) => {
  const formatTime = useMemo(
    () => (zone) => {
      const now = new Date();
      const options = {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return now.toLocaleTimeString("en-GB", options).substring(0, 5);
    },
    [],
  );

  const [time, setTime] = useState(() => formatTime(timeZone));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(formatTime(timeZone));
    }, 1000);
    return () => clearInterval(timer);
  }, [formatTime, timeZone]);

  return (
    <Paper
      variant="outlined"
      sx={{
        px: 2.5,
        py: 1.5,
        minHeight: 108,
        minWidth: 86,
        textAlign: "center",
        borderRadius: 3,
        borderColor: "divider",
        backgroundImage: isDarkMode
          ? "linear-gradient(135deg, rgba(2,6,23,0.75), rgba(15,23,42,0.55))"
          : "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(14,165,233,0.08))",
        color: isDarkMode ? "#f8fafc" : "#0f172a",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          letterSpacing: 0.6,
          color: isDarkMode ? "rgba(248,250,252,0.8)" : "#475569",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: 700, mt: 0.5 }}
      >
        {time || "--:--"}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          textTransform: "uppercase",
          color: isDarkMode ? "rgba(248,250,252,0.7)" : "#475569",
        }}
      >
        {city}
      </Typography>
    </Paper>
  );
};

const WorldClock = () => {
  const { mode } = useColorMode();
  const isDarkMode = mode === "dark";
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
      sx={{
        mt: 8,
        flexWrap: "wrap",
        contentVisibility: "auto",
        containIntrinsicSize: "120px",
      }}
    >
      {timeZones.map(({ label, timeZone, city }) => (
        <Clock
          key={label}
          label={label}
          timeZone={timeZone}
          city={city}
          isDarkMode={isDarkMode}
        />
      ))}
    </Stack>
  );
};

export default WorldClock;
