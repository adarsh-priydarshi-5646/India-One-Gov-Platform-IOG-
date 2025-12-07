import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchComplaints, fetchStats } from '@/store/complaintSlice';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Schedule,
  Warning,
  AddCircle,
  Assessment,
  Report,
  Work,
} from '@mui/icons-material';

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { complaints, stats, isLoading } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(fetchComplaints({ page: 1, limit: 5 }));
    dispatch(fetchStats());
  }, [dispatch]);

  const quickActions = [
    {
      titleKey: 'complaints.fileComplaint',
      descriptionKey: 'Report infrastructure or service issues',
      icon: <AddCircle />,
      color: '#1976d2',
      path: '/file-complaint',
    },
    {
      titleKey: 'fir.fileFIR',
      descriptionKey: 'Report a crime incident',
      icon: <Report />,
      color: '#d32f2f',
      path: '/file-fir',
    },
    {
      titleKey: 'Find Jobs',
      descriptionKey: 'Browse employment opportunities',
      icon: <Work />,
      color: '#388e3c',
      path: '/jobs',
    },
    {
      titleKey: 'View Analytics',
      descriptionKey: 'Track your submissions',
      icon: <Assessment />,
      color: '#f57c00',
      path: '/analytics',
    },
  ];

  const statCards = [
    {
      titleKey: 'dashboard.totalComplaints',
      value: stats?.total || 0,
      icon: <Assessment />,
      color: '#1976d2',
      trend: '+12%',
    },
    {
      titleKey: 'dashboard.pending',
      value: (stats?.submitted || 0) + (stats?.assigned || 0) + (stats?.in_progress || 0),
      icon: <Schedule />,
      color: '#ed6c02',
      trend: '-5%',
    },
    {
      titleKey: 'dashboard.resolved',
      value: stats?.resolved || 0,
      icon: <CheckCircle />,
      color: '#2e7d32',
      trend: '+18%',
    },
    {
      titleKey: 'dashboard.avgResolution',
      value: `${Math.round(stats?.avg_resolution_days || 0)}d`,
      icon: <TrendingUp />,
      color: '#9c27b0',
      trend: '-2d',
    },
  ];

  return (
    <Container maxWidth="xl">
      {/* Welcome Section */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom>
          {t('dashboard.welcomeBack')}, {user?.fullName}! 👋
        </Typography>
        <Typography variant="body1">
          Track your complaints, file reports, and access government services all in one place.
        </Typography>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {t(stat.titleKey)}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Chip
                      label={stat.trend}
                      size="small"
                      sx={{
                        bgcolor: stat.trend.startsWith('+') ? '#e8f5e9' : '#fff3e0',
                        color: stat.trend.startsWith('+') ? '#2e7d32' : '#ed6c02',
                      }}
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              {t('dashboard.quickActions')}
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: action.color, width: 48, height: 48 }}>
                          {action.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{t(action.titleKey)}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {action.descriptionKey}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">{t('dashboard.recentActivity')}</Typography>
              <Button size="small" onClick={() => navigate('/complaints')}>
                {t('common.view')} All
              </Button>
            </Box>

            {isLoading ? (
              <LinearProgress />
            ) : complaints.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="textSecondary">{t('complaints.noComplaints')}</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddCircle />}
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/file-complaint')}
                >
                  {t('complaints.fileFirstComplaint')}
                </Button>
              </Box>
            ) : (
              <List>
                {complaints.slice(0, 5).map((complaint) => (
                  <ListItem
                    key={complaint.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                    onClick={() => navigate(`/complaints/${complaint.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(complaint.status) }}>
                        {getStatusIcon(complaint.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={complaint.title}
                      secondary={
                        <>
                          {complaint.complaintNumber} • {complaint.category}
                          <br />
                          {new Date(complaint.createdAt).toLocaleDateString()}
                        </>
                      }
                    />
                    <Chip
                      label={complaint.status.replace('_', ' ')}
                      size="small"
                      sx={{
                        bgcolor: getStatusColor(complaint.status),
                        color: 'white',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem',
              }}
            >
              {user?.fullName?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{user?.fullName}</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {user?.email || user?.phoneNumber}
            </Typography>
            <Chip label={user?.role} color="primary" size="small" sx={{ mt: 1 }} />
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/profile')}
            >
              {t('common.view')} {t('profile.title')}
            </Button>
          </Paper>

          {/* System Status */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.systemStatus')}
            </Typography>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Auth Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Complaint Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Crime Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
            </Box>
          </Paper>

          {/* Help & Support */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.needHelp')}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Contact our support team for assistance
            </Typography>
            <Button variant="contained" fullWidth>
              {t('dashboard.contactSupport')}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SUBMITTED: '#2196f3',
    ASSIGNED: '#ff9800',
    IN_PROGRESS: '#9c27b0',
    RESOLVED: '#4caf50',
    CLOSED: '#757575',
    REJECTED: '#f44336',
  };
  return colors[status] || '#000';
}

function getStatusIcon(status: string) {
  const icons: Record<string, React.ReactNode> = {
    SUBMITTED: <Schedule />,
    ASSIGNED: <Schedule />,
    IN_PROGRESS: <Schedule />,
    RESOLVED: <CheckCircle />,
    CLOSED: <CheckCircle />,
    REJECTED: <Warning />,
  };
  return icons[status] || <Schedule />;
}
