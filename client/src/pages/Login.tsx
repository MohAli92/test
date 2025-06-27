import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Button, Container, TextField, Typography, Paper, Stack, Alert, Link,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
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
  const [phone, setPhone] = useState('');
  const [whatsAppCode, setWhatsAppCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
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

  const handleSendWhatsAppCode = async () => {
    setError(null);
    if (!phone || phone.length < 8) {
      setError('Please enter a valid WhatsApp number (with country code)');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/send-whatsapp-code`, { phone });
      setCodeSent(true);
    } catch (err: any) {
      setError('Failed to send WhatsApp code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWhatsAppCode = async () => {
    setError(null);
    if (!whatsAppCode || whatsAppCode.length !== 6) {
      setError('Please enter the 6-digit code sent to your WhatsApp');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/verify-whatsapp-code`, { phone, code: whatsAppCode });
      setCodeVerified(true);
    } catch (err: any) {
      setError('Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
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

      if (!phone || phone.length < 8) {
        setError('Please enter a valid WhatsApp number (with country code)');
        return;
      }

      if (!codeVerified) {
        setError('Please verify your WhatsApp number first');
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
          phone,
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
      codeVerified &&
      firstName &&
      lastName &&
      gender &&
      dateOfBirth &&
      email &&
      password &&
      confirmPassword &&
      phone
    ) {
      // نفذ التسجيل تلقائيًا
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
    // eslint-disable-next-line
  }, [codeVerified]);

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
                <TextField
                  label="WhatsApp Number"
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPhone(e.target.value);
                    setError(null);
                  }}
                  fullWidth
                  required
                  error={!!error && error.toLowerCase().includes('whatsapp')}
                  helperText={error && error.toLowerCase().includes('whatsapp') ? error : "Enter your WhatsApp number with country code (e.g. +201234567890)"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mt: 1 }}
                />
                {/* WhatsApp Instructions Box */}
                {isSignUp && (
                  <Box sx={{ border: '2px solid #25d366', borderRadius: 3, background: 'linear-gradient(90deg, #eaf6ff 60%, #d4f8e8 100%)', p: 2, mb: 2, mt: 1, boxShadow: '0 2px 12px rgba(60,72,88,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 1, color: '#075e54', fontWeight: 500, textAlign: 'center' }}>
                      <span role="img" aria-label="whatsapp">💬</span> To receive the code via WhatsApp, send <b>join government-think</b> to <b style={{ color: '#25d366' }}>+14155238886</b> first.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                      <Box
                        sx={{
                          bgcolor: '#fff',
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          fontFamily: 'monospace',
                          fontSize: 18,
                          flexGrow: 1,
                          border: '1px solid #eee',
                          mr: 1,
                          textAlign: 'center',
                          letterSpacing: 1.5
                        }}
                      >
                        join government-think
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 0, px: 1, borderColor: '#25d366', color: '#25d366', '&:hover': { borderColor: '#128c7e', background: '#eafaf1' } }}
                        onClick={() => {
                          navigator.clipboard.writeText('join government-think');
                        }}
                        title="Copy code"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" style={{ fill: '#25d366' }}><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      </Button>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ bgcolor: '#25d366', color: '#fff', fontWeight: 700, letterSpacing: 1, '&:hover': { bgcolor: '#128c7e' }, boxShadow: '0 2px 8px #25d36633' }}
                      href="https://wa.me/14155238886"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span style={{ marginRight: 8, fontWeight: 900 }}>WhatsApp</span> OPEN CHAT
                    </Button>
                  </Box>
                )}
                {isSignUp && !codeSent && (
                  <Button
                    variant="outlined"
                    onClick={handleSendWhatsAppCode}
                    disabled={loading || !phone || phone.length < 8}
                    sx={{ fontWeight: 600 }}
                  >
                    Send WhatsApp Code
                  </Button>
                )}
                {isSignUp && codeSent && !codeVerified && (
                  <Box>
                    <TextField
                      label="Verification Code"
                      value={whatsAppCode}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatsAppCode(e.target.value)}
                      fullWidth
                      required
                      sx={{ mt: 1 }}
                      helperText="Enter the 6-digit code sent to your WhatsApp"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleVerifyWhatsAppCode}
                      disabled={loading || !whatsAppCode || whatsAppCode.length !== 6}
                      sx={{ fontWeight: 600, mt: 1 }}
                    >
                      Verify Code
                    </Button>
                  </Box>
                )}
                {isSignUp && codeVerified && (
                  <Alert severity="success">WhatsApp number verified successfully!</Alert>
                )}
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !email || !password || (isSignUp && (!confirmPassword || !gender || !dateOfBirth || !firstName || !lastName || !phone || !codeVerified))}
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
                  setPhone('');
                  setWhatsAppCode('');
                  setCodeSent(false);
                  setCodeVerified(false);
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