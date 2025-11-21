import { useEffect, useMemo, useState } from "react";
import { Box, Card, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import WeatherDustIcon from "@mui/icons-material/Grain";

const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN || "";

const AQI_SCALE = [
  { max: 50, label: "Good", color: "success.main" },
  { max: 100, label: "Moderate", color: "warning.main" },
  { max: 150, label: "Unhealthy (SG)", color: "warning.dark" },
  { max: 200, label: "Unhealthy", color: "error.main" },
  { max: 300, label: "Very Unhealthy", color: "error.dark" },
  { max: Infinity, label: "Hazardous", color: "error.dark" },
];

const GREETING_TRANSLATIONS = {
  ta: {
    morning: "காலை வணக்கம்",
    afternoon: "மதிய வணக்கம்",
    evening: "மாலை வணக்கம்",
  },
  hi: {
    morning: "सुप्रभात",
    afternoon: "नमस्कार",
    evening: "शुभ संध्या",
  },
};

function getGreeting(now, languageCode) {
  const hour = now.getHours();
  const key = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const localized = GREETING_TRANSLATIONS[languageCode]?.[key];
  if (localized) return localized;

  if (key === "morning") return "Good morning";
  if (key === "afternoon") return "Good afternoon";
  return "Good evening";
}

function getLanguageName(locale) {
  try {
    const display = new Intl.DisplayNames([locale], { type: "language" });
    const base = locale.split("-")[0];
    return display.of(base);
  } catch {
    return null;
  }
}

function describeAqi(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return AQI_SCALE.find((item) => value <= item.max) || AQI_SCALE[0];
}

function extractLanguageCode(languages) {
  if (!languages) return null;

  if (Array.isArray(languages)) {
    const first = languages[0];
    if (typeof first === "string" && first.trim()) return first.split(";")[0].split("-")[0];
    if (first?.code) return String(first.code).split("-")[0];
  }

  if (typeof languages === "string") {
    const first = languages.split(",")[0];
    if (first) return first.split(";")[0].split("-")[0];
  }

  return null;
}

function pickLocalLanguage(ipData) {
  const ipLanguage = extractLanguageCode(ipData?.languages);
  if (ipLanguage) return ipLanguage;

  const region = ipData?.region || "";
  const city = ipData?.city || "";
  const country = ipData?.country_code;

  if (country === "IN" && (/tamil nadu/i.test(region) || /coimbatore/i.test(city))) return "ta";
  if (country === "IN") return "hi";
  return null;
}

export default function HeroGreeting() {
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState("Global");
  const [aqi, setAqi] = useState(null);
  const [aqiLabel, setAqiLabel] = useState("");
  const [aqiColor, setAqiColor] = useState("");
  const [aqiScaleName, setAqiScaleName] = useState("Global AQI");
  const [aqiLoading, setAqiLoading] = useState(false);
  const [aqiError, setAqiError] = useState("");
  const [localLanguageCode, setLocalLanguageCode] = useState("");

  const locale = navigator.language || "en-US";
  const greetingLocale = localLanguageCode || locale;
  const languageCode = greetingLocale.split("-")[0];
  const greeting = useMemo(() => getGreeting(new Date(), languageCode), [languageCode]);
  const languageName = useMemo(() => getLanguageName(greetingLocale), [greetingLocale]);

  useEffect(() => {
    if (!WAQI_TOKEN) {
      setAqiError("AQI unavailable");
    }

    const controller = new AbortController();

    async function detectLocation() {
      try {
        const response = await fetch("https://ipwho.is/", { signal: controller.signal });
        if (!response.ok) throw new Error("IP lookup failed");
        const data = await response.json();
        if (data?.latitude && data?.longitude) {
          setCoords({ latitude: data.latitude, longitude: data.longitude });
          const cityCountry = [data.city, data.country_code].filter(Boolean).join(", ");
          if (cityCountry) {
            setLocationLabel(cityCountry);
          }
          const detectedLanguage = pickLocalLanguage(data);
          if (detectedLanguage) {
            setLocalLanguageCode(detectedLanguage);
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setLocationLabel("Worldwide");
        }
      }
    }

    detectLocation();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!coords || !WAQI_TOKEN) return;
    const controller = new AbortController();

    async function loadAqi() {
      setAqiLoading(true);
      setAqiError("");
      try {
        const response = await fetch(
          `https://api.waqi.info/feed/geo:${coords.latitude};${coords.longitude}/?token=${WAQI_TOKEN}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`AQI request failed (${response.status})`);
        }
        const data = await response.json();
        const value = data?.data?.aqi;
        if (typeof value === "number") {
          setAqi(value);
          const desc = describeAqi(value);
          setAqiLabel(desc?.label || "");
          setAqiColor(desc?.color || "");
          setAqiScaleName("AQI (WAQI)");
        } else {
          throw new Error("AQI unavailable");
        }
        const city = data?.data?.city?.name;
        if (city && (!locationLabel || locationLabel === "Global" || locationLabel === "Worldwide")) {
          setLocationLabel(city);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setAqiError("AQI unavailable");
        }
      } finally {
        setAqiLoading(false);
      }
    }

    loadAqi();
    return () => controller.abort();
  }, [coords, locationLabel]);

  const salutation = languageName ? `${greeting} · ${languageName}` : greeting;

  return (
    <Stack spacing={2} alignItems="center" sx={{ textAlign: "center" }}>
      <Typography
        variant="h2"
        sx={{
          mb: 0.5,
          fontSize: { xs: "1.8rem", sm: "2rem", md: "2.3rem" },
          fontWeight: 700,
          minHeight: { xs: 42, sm: 48, md: 54 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {salutation}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          flexWrap: "wrap",
          justifyContent: "center",
          minHeight: 48,
          rowGap: 1,
        }}
      >
        <Chip
          icon={<RoomIcon />}
          label={locationLabel || "Locating…"}
          variant="outlined"
          sx={{
            borderColor: "divider",
            color: "text.primary",
            minWidth: 140,
            height: 36,
          }}
        />
        <Card
          elevation={0}
          sx={{
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            display: "inline-flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 210,
            minHeight: 76,
            bgcolor: "background.paper",
          }}
        >
          <WeatherDustIcon sx={{ color: aqiColor || "text.secondary" }} />
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="caption" color="text.secondary">
              {aqiScaleName}
            </Typography>
            {aqiLoading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={16} />
                <Typography variant="body2">Checking...</Typography>
              </Stack>
            ) : aqi !== null ? (
              <Typography variant="body1" sx={{ fontWeight: 700, color: aqiColor || "text.primary" }}>
                {Math.round(aqi)} — {aqiLabel || "AQI"}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {aqiError || "Waiting for location"}
              </Typography>
            )}
          </Box>
        </Card>
      </Stack>
    </Stack>
  );
}
