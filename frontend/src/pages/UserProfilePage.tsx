import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  LocationOn,
  Phone,
  Email,
  PersonOutline,
  Save,
  Cancel,
} from '@mui/icons-material';

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    state: user?.state || '',
    district: user?.district || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email || '',
        state: user.state || '',
        district: user.district || '',
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user.fullName,
      email: user.email || '',
      state: user.state || '',
      district: user.district || '',
    });
  };

  const handleSave = () => {
    // TODO: Implement profile update  API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
      CITIZEN: 'primary',
      OFFICER: 'secondary',
      POLITICIAN: 'warning',
      ADMIN: 'error',
      SUPER_ADMIN: 'error',
    };
    return colors[role] || 'default';
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Profile
          </Typography>
          {!isEditing && (
            <Button color="inherit" startIcon={<Edit />} onClick={handleEdit}>
              Edit
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Profile Header */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
              }}
            >
              {user.fullName.charAt(0).toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                {user.fullName}
              </Typography>
              <Chip
                label={user.role.replace('_', ' ')}
                color={getRoleColor(user.role)}
                size="medium"
              />
              <Box mt={1}>
                <Typography variant="body2" color="textSecondary">
                  {user.isVerified ? '✓ Verified Account' : '⚠ Not Verified'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Profile Details */}
        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Phone color="action" />
                      <div>
                        <Typography variant="body2" color="textSecondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body1">{user.phoneNumber}</Typography>
                      </div>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        InputProps={{
                          startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    ) : (
                      <Box display="flex" alignItems="center" gap={2}>
                        <Email color="action" />
                        <div>
                          <Typography variant="body2" color="textSecondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {user.email || 'Not provided'}
                          </Typography>
                        </div>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        InputProps={{
                          startAdornment: <PersonOutline color="action" sx={{ mr: 1 }} />,
                        }}
                      />
                    ) : (
                      <Box display="flex" alignItems="center" gap={2}>
                        <PersonOutline color="action" />
                        <div>
                          <Typography variant="body2" color="textSecondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1">{user.fullName}</Typography>
                        </div>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                      />
                    ) : (
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationOn color="action" />
                        <div>
                          <Typography variant="body2" color="textSecondary">
                            State
                          </Typography>
                          <Typography variant="body1">
                            {user.state || 'Not provided'}
                          </Typography>
                        </div>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        label="District"
                        value={formData.district}
                        onChange={(e) => handleChange('district', e.target.value)}
                      />
                    ) : (
                      <Box display="flex" alignItems="center" gap={2}>
                        <LocationOn color="action" />
                        <div>
                          <Typography variant="body2" color="textSecondary">
                            District
                          </Typography>
                          <Typography variant="body1">
                            {user.district || 'Not provided'}
                          </Typography>
                        </div>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                {isEditing && (
                  <Box mt={3} display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      Save Changes
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Statistics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Complaints Filed
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Resolved
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        In Progress
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="error.main">
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        FIRs Filed
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
