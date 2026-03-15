import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useColorMode } from "../providers/ColorModeProvider";

const WEATHER_ENDPOINT = "/api/current-weather?preset=world-clock";

const Clock = ({ timeZone, label, city, isDarkMode, temperatureLabel }) => {
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
        minHeight: 124,
        minWidth: 106,
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
          display: "block",
          mt: 0.5,
          fontWeight: 700,
          color: isDarkMode ? "rgba(248,250,252,0.88)" : "#1e293b",
        }}
      >
        {temperatureLabel}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 0.35,
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

function formatTemperaturePair(weather) {
  const celsius = weather?.temperature?.celsius;
  const fahrenheit = weather?.temperature?.fahrenheit;

  if (!Number.isFinite(celsius) || !Number.isFinite(fahrenheit)) {
    return "";
  }

  return `${Math.round(celsius)}°C / ${Math.round(fahrenheit)}°F`;
}

const WorldClock = ({ compact = false }) => {
  const { mode } = useColorMode();
  const isDarkMode = mode === "dark";
  const [weatherByKey, setWeatherByKey] = useState({});
  const [weatherError, setWeatherError] = useState("");
  const timeZones = [
    { label: "SGT", timeZone: "Asia/Singapore", city: "SIN", weatherKey: "SIN" },
    { label: "IST", timeZone: "Asia/Kolkata", city: "MAA", weatherKey: "MAA" },
    { label: "UTC", timeZone: "Etc/UTC", city: "LON", weatherKey: "LON" },
    { label: "EDT", timeZone: "America/New_York", city: "MCO", weatherKey: "MCO" },
    { label: "PDT", timeZone: "America/Los_Angeles", city: "SFO", weatherKey: "SFO" },
  ];

  useEffect(() => {
    let active = true;

    async function loadWeather() {
      try {
        setWeatherError("");
        const response = await fetch(WEATHER_ENDPOINT);

        if (!response.ok) {
          throw new Error(`Weather request failed (${response.status})`);
        }

        const payload = await response.json();
        const nextWeatherByKey = Object.fromEntries(
          (payload?.items || []).map((item) => [item.key, item]),
        );
        if (!active) {
          return;
        }

        setWeatherByKey(nextWeatherByKey);
      } catch (error) {
        console.error("Failed to load current weather", error);
        if (active) {
          setWeatherError(error?.message || "Weather unavailable");
        }
      }
    }

    loadWeather();
    const refreshId = window.setInterval(loadWeather, 10 * 60 * 1000);

    return () => {
      active = false;
      window.clearInterval(refreshId);
    };
  }, []);

  return (
    <Stack
      direction="row"
      spacing={{ xs: 1.5, md: 2.5 }}
      justifyContent="center"
      alignItems="stretch"
      sx={{
        mt: compact ? 2 : 8,
        flexWrap: "wrap",
        contentVisibility: "auto",
        containIntrinsicSize: "132px",
      }}
    >
      {timeZones.map(({ label, timeZone, city, weatherKey }) => (
        <Clock
          key={label}
          label={label}
          timeZone={timeZone}
          city={city}
          isDarkMode={isDarkMode}
          temperatureLabel={
            formatTemperaturePair(weatherByKey[weatherKey]) ||
            (weatherError ? "Temp unavailable" : "Loading temp...")
          }
        />
      ))}
    </Stack>
  );
};

export default WorldClock;
