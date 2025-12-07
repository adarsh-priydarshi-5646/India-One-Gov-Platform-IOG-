import { useState } from 'react';
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
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Home,
  Apartment,
  Villa,
  LocationOn,
  AttachMoney,
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

export default function HousingServicesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const services = [
    { title: 'PM Awas Yojana', icon: <Home />, color: '#2563EB', beneficiaries: '1.2 Cr' },
    { title: 'Affordable Housing', icon: <Apartment />, color: '#059669', beneficiaries: '50 L' },
    { title: 'Property Registration', icon: <Villa />, color: '#DC2626', beneficiaries: 'All' },
    { title: 'Housing Loan', icon: <AttachMoney />, color: '#7C3AED', beneficiaries: 'All' },
  ];

  const schemes = [
    {
      name: 'Pradhan Mantri Awas Yojana - Urban',
      subsidy: 'Up to ₹2.67 Lakh',
      eligibility: 'EWS/LIG/MIG',
      status: 'Active',
    },
    {
      name: 'Pradhan Mantri Awas Yojana - Gramin',
      subsidy: '₹1.2 Lakh (Plain), ₹1.3 Lakh (Hilly)',
      eligibility: 'Rural Poor',
      status: 'Active',
    },
    {
      name: 'Credit Linked Subsidy Scheme',
      subsidy: 'Interest Subsidy up to 6.5%',
      eligibility: 'EWS/LIG/MIG',
      status: 'Active',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Housing Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Apply for housing schemes and property services
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
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.beneficiaries} Beneficiaries
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="Housing Schemes" />
            <Tab label="Apply for House" />
            <Tab label="Property Registration" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Government Housing Schemes
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {schemes.map((scheme, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {scheme.name}
                          </Typography>
                          <Chip label={scheme.status} size="small" color="success" />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Subsidy
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scheme.subsidy}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Eligibility
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scheme.eligibility}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Button variant="contained" size="small" fullWidth sx={{ mt: 2, borderRadius: 1 }}>
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Apply for Government Housing
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Full Name" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Aadhaar Number" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Annual Income" type="number" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Category"
                    required
                  >
                    <MenuItem value="ews">EWS (Economically Weaker Section)</MenuItem>
                    <MenuItem value="lig">LIG (Low Income Group)</MenuItem>
                    <MenuItem value="mig">MIG (Middle Income Group)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Current Address" multiline rows={3} required />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" sx={{ borderRadius: 1 }}>
                    Submit Application
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Property Registration Services
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Property Address" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Property Type" select required>
                    <MenuItem value="residential">Residential</MenuItem>
                    <MenuItem value="commercial">Commercial</MenuItem>
                    <MenuItem value="agricultural">Agricultural</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Property Value" type="number" required />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Owner Name" required />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" sx={{ borderRadius: 1 }}>
                    Register Property
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
