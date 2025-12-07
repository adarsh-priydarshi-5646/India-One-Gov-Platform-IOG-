import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  DirectionsCar,
  TwoWheeler,
  LocalShipping,
  CardMembership,
  Payment,
  Assessment,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>;
}

export default function TransportServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [dlNumber, setDlNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const services = [
    { title: 'Driving License', icon: <CardMembership />, color: '#2563EB' },
    { title: 'Vehicle Registration', icon: <DirectionsCar />, color: '#059669' },
    { title: 'Pay Challan', icon: <Payment />, color: '#DC2626' },
    { title: 'Fitness Certificate', icon: <Assessment />, color: '#7C3AED' },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Transport Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Driving license, vehicle registration, and transport services
            </Typography>
          </Box>
        </Box>

        {/* Service Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  border: '1px solid #DDDDDD',
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1,
                    bgcolor: `${service.color}15`,
                    color: service.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {service.title}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="Driving License" />
            <Tab label="Vehicle Registration" />
            <Tab label="Traffic Challan" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Apply for Driving License
                  </Typography>
                  <Box component="form" sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Full Name" required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Aadhaar Number" required />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField fullWidth label="Address" multiline rows={3} required />
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" fullWidth sx={{ borderRadius: 1 }}>
                          Submit Application
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Check DL Status
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Driving License Number"
                      value={dlNumber}
                      onChange={(e) => setDlNumber(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="outlined" fullWidth sx={{ borderRadius: 1 }}>
                      Check Status
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Vehicle Registration Services
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Number"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button variant="contained" fullWidth sx={{ borderRadius: 1 }}>
                    Check Registration
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Pay Traffic Challan
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Challan Number" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button variant="contained" fullWidth sx={{ borderRadius: 1 }}>
                    Pay Now
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
