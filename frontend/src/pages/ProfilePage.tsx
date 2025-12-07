import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Avatar,
  TextField,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  Badge as BadgeIcon,
} from '@mui/icons-material';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Save profile logic here
    setIsEditing(false);
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {t('profile.myProfile')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account information
            </Typography>
          </Box>
        </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {user?.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email || user?.phoneNumber}
            </Typography>
            <Chip
              label={user?.role}
              color="primary"
              sx={{ mt: 1, mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <BadgeIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  Member since {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Account Stats
            </Typography>
            <Stack spacing={2} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Total Complaints</Typography>
                <Typography variant="body2" fontWeight={600}>
                  0
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">FIRs Filed</Typography>
                <Typography variant="body2" fontWeight={600}>
                  0
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Job Applications</Typography>
                <Typography variant="body2" fontWeight={600}>
                  0
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                Personal Information
              </Typography>
              {!isEditing ? (
                <Button
                  startIcon={<Edit />}
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    startIcon={<Save />}
                    variant="contained"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    startIcon={<Cancel />}
                    variant="outlined"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="PIN Code"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Security Settings
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Password
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last changed 30 days ago
                </Typography>
                <Button variant="outlined" size="small">
                  Change Password
                </Button>
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Two-Factor Authentication
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Add an extra layer of security to your account
                </Typography>
                <Button variant="outlined" size="small">
                  Enable 2FA
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}
