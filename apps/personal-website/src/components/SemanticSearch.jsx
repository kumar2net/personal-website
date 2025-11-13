import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const endpoint =
  import.meta.env.VITE_SEMANTIC_SEARCH_ENDPOINT?.trim() ||
  "/api/semantic-search";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({ tookMs: 0, provider: "" });
  const [apiAvailable, setApiAvailable] = useState(true);
  const unavailableMessage =
    "Semantic search API isn't running in this environment. Start `vercel dev` or set VITE_SEMANTIC_SEARCH_ENDPOINT.";

  const canSearch = useMemo(
    () => query.trim().length > 0 && !loading && apiAvailable,
    [query, loading, apiAvailable],
  );

  const onSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!canSearch) {
        return;
      }
      setLoading(true);
      setError("");
      setResults([]);
      setMeta({ tookMs: 0, provider: "" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: query.trim(),
            topK: Math.max(1, Math.min(10, Number(topK) || 5)),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setResults(Array.isArray(data?.results) ? data.results : []);
        setMeta({
          tookMs: Number(data?.tookMs || 0),
          provider: data?.provider || "",
        });
      } catch (err) {
        const message =
          typeof err?.message === "string" ? err.message : "Search failed";
        if (message.includes("404")) {
          setApiAvailable(false);
          setError(unavailableMessage);
        } else {
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    },
    [canSearch, query, topK, unavailableMessage],
  );

  return (
    <Paper
      component="section"
      elevation={0}
      sx={(theme) => ({
        mb: 6,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)",
        backgroundImage:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(2,6,23,0.95), rgba(15,23,42,0.8))"
            : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(236,244,255,0.9))",
        "&:has(input:focus)": {
          borderColor: theme.palette.primary.main,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 18px 30px rgba(2,6,23,0.8)"
              : "0 18px 30px rgba(37,99,235,0.18)",
        },
      })}
    >
      <Stack
        component="form"
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        onSubmit={onSubmit}
      >
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts semantically (try: india usa trade gap)"
          label="Semantic search"
        />
        <TextField
          label="Top K"
          id="topk"
          type="number"
          inputProps={{ min: 1, max: 10 }}
          value={topK}
          onChange={(e) => setTopK(e.target.value)}
          sx={{ width: { xs: "100%", md: 120 } }}
        />
        <Button
          type="submit"
          disabled={!canSearch}
          variant="contained"
          color="primary"
          size="large"
          sx={{
            minWidth: { xs: "100%", md: 140 },
          }}
        >
          {loading ? "Searching…" : "Search"}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {!error && !apiAvailable && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {unavailableMessage}
        </Alert>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", textTransform: "uppercase" }}
          >
            Found {results.length}
            {meta.tookMs ? ` in ${meta.tookMs} ms` : ""}
            {meta.provider ? ` · via ${meta.provider}` : ""}
          </Typography>
          <List
            sx={{
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            {results.map((r, index) => (
              <Box key={r.id}>
                {index !== 0 && <Divider component="li" />}
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to={r.url}
                    sx={{
                      alignItems: "flex-start",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" color="text.primary">
                          {r.title || r.id}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {r.excerpt ? (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {r.excerpt}
                            </Typography>
                          ) : null}
                          <Typography
                            variant="caption"
                            color="text.disabled"
                            sx={{ mt: 0.5, display: "inline-block" }}
                          >
                            score:{" "}
                            {typeof r.score === "number"
                              ? r.score.toFixed(4)
                              : r.score}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}
