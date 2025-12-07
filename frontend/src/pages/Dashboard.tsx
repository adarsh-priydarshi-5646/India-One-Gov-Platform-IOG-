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
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from '@mui/material';
import {
  Description,
  Security,
  Work,
  AccountBalance,
  Gavel,
  School,
  LocalHospital,
  Business,
  DirectionsCar,
  Home,
  Phone,
  Public,
  ArrowForward,
} from '@mui/icons-material';

export default function ImprovedDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { complaints, stats } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    dispatch(fetchComplaints({ page: 1, limit: 8 }));
    dispatch(fetchStats());
  }, [dispatch]);

  // Government Services - Chinese Portal Style (6 columns)
  const governmentServices = [
    { titleKey: 'services.complaints', icon: <Description />, path: '/file-complaint', color: '#DC2626' },
    { titleKey: 'services.fir', icon: <Security />, path: '/file-fir', color: '#EA580C' },
    { titleKey: 'services.corruption', icon: <Gavel />, path: '/corruption-report', color: '#B91C1C' },
    { titleKey: 'services.jobs', icon: <Work />, path: '/jobs', color: '#D97706' },
    { titleKey: 'services.taxation', icon: <AccountBalance />, path: '/tax', color: '#16A34A' },
    { titleKey: 'services.legal', icon: <Gavel />, path: '/services', color: '#0891B2' },
    { titleKey: 'services.education', icon: <School />, path: '/education', color: '#2563EB' },
    { titleKey: 'services.health', icon: <LocalHospital />, path: '/health', color: '#7C3AED' },
    { titleKey: 'services.business', icon: <Business />, path: '/business', color: '#DB2777' },
    { titleKey: 'services.transport', icon: <DirectionsCar />, path: '/transport', color: '#059669' },
    { titleKey: 'services.housing', icon: <Home />, path: '/housing', color: '#0284C7' },
    { title: 'Agriculture', icon: <Description />, path: '/agriculture', color: '#16A34A' },
    { title: 'Social Welfare', icon: <Description />, path: '/social-welfare', color: '#EC4899' },
    { title: 'Pension', icon: <AccountBalance />, path: '/pension', color: '#7C3AED' },
    { title: 'All Schemes', icon: <Description />, path: '/all-schemes', color: '#0284C7' },
    { title: 'Policies', icon: <Gavel />, path: '/policies', color: '#DC2626' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4, px: 3 }}>
        {/* Main Services Section - Chinese Grid Style */}
        <Paper elevation={0} sx={{ mb: 3, p: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              {t('dashboard.governmentServices')}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {governmentServices.map((service, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    height: '100%',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(service.path)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        margin: '0 auto',
                        mb: 1,
                        borderRadius: 1,
                        bgcolor: `${service.color}15`,
                        color: service.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(service.icon, { sx: { fontSize: 32 } })}
                    </Box>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8125rem' }}>
                      {t(service.titleKey)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column - Statistics & Recent */}
          <Grid item xs={12} md={8}>
            {/* Statistics Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.totalComplaints')}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#DC2626">
                    {stats?.total || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.pending')}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#D97706">
                    {(stats?.submitted || 0) + (stats?.assigned || 0) + (stats?.in_progress || 0)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#DCFCE7', border: '1px solid #BBF7D0' }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.resolved')}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#16A34A">
                    {stats?.resolved || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Recent Activities */}
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('dashboard.recentActivity')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {complaints.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body2" color="text.secondary">
                    {t('complaints.noComplaints')}
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {complaints.slice(0, 6).map((complaint, index) => (
                    <ListItem
                      key={complaint.id}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        mb: 1,
                        cursor: 'pointer',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: '#F9FAFB' },
                      }}
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 40,
                          bgcolor: 'primary.main',
                          borderRadius: 1,
                          mr: 2,
                        }}
                      />
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500}>
                            {complaint.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {complaint.complaintNumber} • {new Date(complaint.createdAt).toLocaleDateString()}
                          </Typography>
                        }
                      />
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                        }}
                      >
                        {complaint.status}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Quick Links & Info */}
          <Grid item xs={12} md={4}>
            {/* Quick Links */}
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('dashboard.quickLinks')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1}>
                {[
                  { label: 'dashboard.myComplaints', path: '/complaints' },
                  { label: 'dashboard.myFIRs', path: '/firs' },
                  { label: 'dashboard.myApplications', path: '/applications' },
                  { label: 'dashboard.myProfile', path: '/profile' },
                  { label: 'dashboard.trackStatus', path: '/track' },
                  { label: 'dashboard.downloadForms', path: '/forms' },
                ].map((link, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': { bgcolor: '#F9FAFB', borderColor: 'primary.main' },
                    }}
                    onClick={() => navigate(link.path)}
                  >
                    <Typography variant="body2">{t(link.label)}</Typography>
                    <ArrowForward fontSize="small" color="action" />
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Contact Information */}
            <Paper elevation={0} sx={{ p: 3 }}>
              <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                  {t('dashboard.contactUs')}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.helpline')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    1800-XXX-XXXX
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.emailSupport')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    support@iog.gov.in
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('dashboard.workingHours')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {t('dashboard.hours')}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
