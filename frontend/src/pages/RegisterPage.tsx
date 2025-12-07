import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { register, verifyOTP, clearError } from '@/store/authSlice';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');

  const steps = ['Enter Details', 'Verify OTP'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.confirmPassword) {
      // TODO: Show error
      return;
    }

    const result = await dispatch(
      register({
        aadhaarNumber: formData.aadhaarNumber,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        role: 'CITIZEN',
      })
    );

    if (register.fulfilled.match(result)) {
      setUserId(result.payload.userId);
      setActiveStep(1);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(verifyOTP({ userId, otp }));

    if (verifyOTP.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            🇮🇳 India One-Gov
          </Typography>
          <Typography variant="h6" gutterBottom align="center">
            Citizen Registration
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Aadhaar Number"
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                margin="normal"
                required
                inputProps={{ maxLength: 12, pattern: '[0-9]{12}' }}
                helperText="12-digit Aadhaar number"
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
                required
                placeholder="+919876543210"
                helperText="Include country code (+91)"
              />

              <TextField
                fullWidth
                label="Email (Optional)"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                helperText="Min 8 characters, 1 uppercase, 1 number, 1 special character"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                margin="normal"
                required
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 3, mb: 2 }}>
                {isLoading ? <CircularProgress size={24} /> : 'Register'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#ff9933', textDecoration: 'none' }}>
                    Login Here
                  </Link>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleVerifyOTP}>
              <Alert severity="info" sx={{ mb: 2 }}>
                An OTP has been sent to your phone number ending with ...{formData.phoneNumber.slice(-4)}
              </Alert>

              <TextField
                fullWidth
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                margin="normal"
                required
                inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                helperText="6-digit OTP"
                autoFocus
              />

              <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 3 }}>
                {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
