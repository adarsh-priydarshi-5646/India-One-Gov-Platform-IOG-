import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
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
  Report,
} from '@mui/icons-material';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const services = [
    { titleKey: 'services.complaints', icon: <Description />, path: '/file-complaint', color: '#DC2626', desc: 'File complaints about government services' },
    { titleKey: 'services.fir', icon: <Security />, path: '/file-fir', color: '#EA580C', desc: 'Report crimes and file FIR online' },
    { titleKey: 'services.corruption', icon: <Report />, path: '/corruption-report', color: '#B91C1C', desc: 'Report corruption cases anonymously' },
    { titleKey: 'services.jobs', icon: <Work />, path: '/jobs', color: '#D97706', desc: 'Browse and apply for government jobs' },
    { title: 'Tax Services', icon: <AccountBalance />, path: '/tax', color: '#16A34A', desc: 'Income tax filing and GST services' },
    { titleKey: 'services.legal', icon: <Gavel />, path: '/services', color: '#0891B2', desc: 'Legal aid and court services' },
    { titleKey: 'services.education', icon: <School />, path: '/education', color: '#2563EB', desc: 'Education services and scholarships' },
    { titleKey: 'services.health', icon: <LocalHospital />, path: '/health', color: '#7C3AED', desc: 'Healthcare and medical services' },
    { titleKey: 'services.business', icon: <Business />, path: '/business', color: '#DB2777', desc: 'Business registration and licenses' },
    { titleKey: 'services.transport', icon: <DirectionsCar />, path: '/transport', color: '#059669', desc: 'Transport and vehicle services' },
    { titleKey: 'services.housing', icon: <Home />, path: '/housing', color: '#0284C7', desc: 'Housing schemes and property services' },
    { title: 'Agriculture', icon: <Description />, path: '/agriculture', color: '#16A34A', desc: 'Farmer welfare and agriculture schemes' },
    { title: 'Social Welfare', icon: <Description />, path: '/social-welfare', color: '#EC4899', desc: 'Social security and welfare schemes' },
    { title: 'Pension', icon: <AccountBalance />, path: '/pension', color: '#7C3AED', desc: 'Pension and retirement planning' },
    { title: 'All Schemes', icon: <Description />, path: '/all-schemes', color: '#0284C7', desc: 'Browse all government schemes' },
    { title: 'Policies', icon: <Gavel />, path: '/policies', color: '#DC2626', desc: 'Government policies and promises' },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Government Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access all government services in one place
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  border: '1px solid #DDDDDD',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => navigate(service.path)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      margin: '0 auto',
                      mb: 2,
                      borderRadius: 1,
                      bgcolor: `${service.color}15`,
                      color: service.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(service.icon, { sx: { fontSize: 36 } })}
                  </Box>
                  <Typography variant="h6" fontWeight={600} textAlign="center" gutterBottom>
                    {t(service.titleKey)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {service.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Popular Services */}
        <Paper elevation={0} sx={{ mt: 4, p: 3, border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Most Used Services
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Aadhaar Services
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Update and download Aadhaar
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  PAN Card
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Apply for new PAN card
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Driving License
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Apply and renew license
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ p: 2, bgcolor: '#F9FAFB', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Voter ID
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Register and update voter ID
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
