import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getApiUrl } from '../utils/api';
import api from '../utils/axios';
import {
  Box, Button, Container, TextField, Typography, Paper, Stack, Alert, Link,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Email, Lock, Person, Wc, CalendarToday, Phone } from '@mui/icons-material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // Password must be at least 6 characters and contain at least one number
    return password.length >= 6 && /\d/.test(password);
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGender(event.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email for both sign in and sign up
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isSignUp) {
      // Additional validations for sign up
      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long and contain at least one number');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (!firstName.trim()) {
        setError('Please enter your first name');
        return;
      }

      if (!lastName.trim()) {
        setError('Please enter your last name');
        return;
      }

      if (!gender) {
        setError('Please select your gender');
        return;
      }

      if (!dateOfBirth) {
        setError('Please select your date of birth');
        return;
      }

      // Check if user is at least 13 years old
      const today = new Date();
      const age = today.getFullYear() - dateOfBirth.getFullYear();
      const monthDiff = today.getMonth() - dateOfBirth.getMonth();
      if (age < 13 || (age === 13 && monthDiff < 0)) {
        setError('You must be at least 13 years old to sign up');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up with MongoDB
        const userData = {
          email,
          password,
            firstName,
            lastName,
            gender,
            phoneVerified: true
        };

        await signup(userData);
          navigate('/');
      } else {
        // Sign In with MongoDB
        await login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
          setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      isSignUp &&
      firstName &&
      lastName &&
      gender &&
      dateOfBirth &&
      email &&
      password &&
      confirmPassword
    ) {
      // نفذ التسجيل تلقائيًا
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
    // eslint-disable-next-line
  }, [isSignUp]);

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(60,72,88,0.10)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
            alt="Welcome Food"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 16, boxShadow: '0 2px 8px rgba(60,72,88,0.10)' }}
          />
          <Typography variant="h4" fontWeight={600} align="center" gutterBottom>
            Share Dish
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
            {isSignUp ? 'Create an account to share and discover meals!' : 'Sign in to share and discover meals!'}
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}
        <form ref={formRef} onSubmit={handleSubmit}>
          <Stack spacing={2} mt={3}>
            {isSignUp && (
              <>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  error={!!error && error.includes('first name')}
                  helperText={error && error.includes('first name') ? error : "Enter your first name"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setLastName(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  error={!!error && error.includes('last name')}
                  helperText={error && error.includes('last name') ? error : "Enter your last name"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                setError(null);
              }}
              fullWidth
              required
              error={!!error && error.includes('email')}
              helperText={error && error.includes('email') ? error : "Enter your email address"}
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                setError(null);
              }}
              fullWidth
              required
              error={!!error && error.includes('password')}
              helperText={
                error && error.includes('password') 
                  ? error 
                  : isSignUp 
                    ? "Password must be at least 6 characters and contain a number" 
                    : "Enter your password"
              }
              autoComplete={isSignUp ? "new-password" : "current-password"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            {isSignUp && (
              <>
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  error={!!error && error.includes('match')}
                  helperText={error && error.includes('match') ? error : "Confirm your password"}
                  autoComplete="new-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl fullWidth required error={!!error && error.includes('gender')}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={gender}
                    label="Gender"
                    onChange={handleGenderChange}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={dateOfBirth}
                    onChange={(newValue: Date | null) => {
                      setDateOfBirth(newValue);
                      setError(null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!error && error.includes('birth'),
                        helperText: error && error.includes('birth') ? error : "Select your date of birth",
                        InputProps: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday />
                            </InputAdornment>
                          ),
                        },
                      }
                    }}
                  />
                </LocalizationProvider>
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !email || !password || (isSignUp && (!confirmPassword || !gender || !dateOfBirth || !firstName || !lastName))}
              sx={{ fontWeight: 600, py: 1.2, fontSize: '1rem', mt: 1 }}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
              <Box sx={{ flex: 1, height: 1, background: '#e0e0e0' }} />
              <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                OR
              </Typography>
              <Box sx={{ flex: 1, height: 1, background: '#e0e0e0' }} />
            </Box>
            <Box textAlign="center">
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setFirstName('');
                  setLastName('');
                  setGender('');
                  setDateOfBirth(null);
                }}
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;