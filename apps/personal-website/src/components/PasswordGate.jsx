import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const STORAGE_KEY = 'utilities-authenticated-v1';

const normalizeValue = (value) =>
  typeof value === 'string' ? value.trim() : '';

const useCredentials = () =>
  useMemo(
    () => ({
      username:
        normalizeValue(import.meta.env.VITE_UTILITIES_USERNAME) || 'utilities',
      password:
        normalizeValue(import.meta.env.VITE_UTILITIES_PASSWORD) || 'dashboard',
    }),
    [],
  );

const PasswordGate = ({ children }) => {
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formState;
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const credentials = useCredentials();

  useEffect(() => {
    try {
      const stored =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem(STORAGE_KEY)
          : null;
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore sessionStorage errors (private browsing, etc.)
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      username.trim() === credentials.username &&
      password.trim() === credentials.password
    ) {
      setIsAuthenticated(true);
      setError('');
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(STORAGE_KEY, 'true');
        }
      } catch {
        // Non-blocking if sessionStorage is unavailable
      }
      return;
    }
    setError('Invalid username or password');
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <Stack spacing={0.5}>
            <Typography variant="h4" component="h1">
              Utilities Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the credentials shared with you to view this dashboard.
            </Typography>
          </Stack>
          {error ? (
            <Alert
              severity="error"
              onClose={() => setError('')}
              sx={{ borderRadius: 2 }}
            >
              {error}
            </Alert>
          ) : null}
          <TextField
            label="Username"
            value={username}
            autoComplete="username"
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                username: event.target.value,
              }))
            }
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large">
            Unlock dashboard
          </Button>
          <Typography variant="caption" color="text.secondary">
            Tip: update `VITE_UTILITIES_USERNAME` and
            `VITE_UTILITIES_PASSWORD` in your `.env` to change credentials.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PasswordGate;
