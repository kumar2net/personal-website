import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const normalizeValue = (value) =>
  typeof value === 'string' ? value.trim() : '';

const useCredentials = ({
  usernameEnvKey,
  passwordEnvKey,
  defaultUsername,
  defaultPassword,
}) =>
  useMemo(
    () => ({
      username: normalizeValue(import.meta.env[usernameEnvKey]) || defaultUsername,
      password: normalizeValue(import.meta.env[passwordEnvKey]) || defaultPassword,
    }),
    [defaultPassword, defaultUsername, passwordEnvKey, usernameEnvKey],
  );

const PasswordGate = ({
  children,
  title = "Utilities Access",
  description = "Enter the credentials shared with you to view this dashboard.",
  usernameEnvKey = 'VITE_UTILITIES_USERNAME',
  passwordEnvKey = 'VITE_UTILITIES_PASSWORD',
  defaultUsername = 'utilities',
  defaultPassword = 'dashboard',
  storageKey = 'utilities-authenticated-v1',
  submitLabel = 'Unlock dashboard',
  helperText,
}) => {
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formState;
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const credentials = useCredentials({
    usernameEnvKey,
    passwordEnvKey,
    defaultUsername,
    defaultPassword,
  });
  const credentialsConfigured = Boolean(
    credentials.username && credentials.password
  );
  const resolvedHelperText =
    helperText ||
    `Tip: update \`${usernameEnvKey}\` and \`${passwordEnvKey}\` in your .env to change credentials.`;

  useEffect(() => {
    try {
      const stored =
        typeof window !== 'undefined'
          ? window.sessionStorage.getItem(storageKey)
          : null;
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // Ignore sessionStorage errors (private browsing, etc.)
    }
  }, [storageKey]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!credentialsConfigured) {
      setError('This password gate is not configured for this environment yet.');
      return;
    }
    if (
      username.trim() === credentials.username &&
      password.trim() === credentials.password
    ) {
      setIsAuthenticated(true);
      setError('');
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(storageKey, 'true');
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
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
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
          {!credentialsConfigured ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              This page is gated, but credentials have not been configured in
              this environment yet.
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
            {submitLabel}
          </Button>
          <Typography variant="caption" color="text.secondary">
            {resolvedHelperText}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default PasswordGate;
