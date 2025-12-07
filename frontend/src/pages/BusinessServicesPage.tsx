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
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Business,
  Store,
  AccountBalance,
  Description,
  CheckCircle,
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

export default function BusinessServicesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    category: '',
    pan: '',
    address: '',
    state: '',
    district: '',
  });

  const services = [
    { title: 'Company Registration', icon: <Business />, color: '#2563EB', desc: 'Register new company' },
    { title: 'GST Registration', icon: <AccountBalance />, color: '#059669', desc: 'Get GST number' },
    { title: 'Trade License', icon: <Store />, color: '#DC2626', desc: 'Apply for license' },
    { title: 'MSME Registration', icon: <Description />, color: '#7C3AED', desc: 'Udyam registration' },
  ];

  const steps = ['Business Details', 'Documents', 'Review & Submit'];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Business Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register your business and get licenses online
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
                  {service.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="New Registration" />
            <Tab label="Track Application" />
            <Tab label="Renew License" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Business Name"
                      value={businessData.businessName}
                      onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Business Type"
                      value={businessData.businessType}
                      onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })}
                      required
                    >
                      <MenuItem value="proprietorship">Proprietorship</MenuItem>
                      <MenuItem value="partnership">Partnership</MenuItem>
                      <MenuItem value="llp">LLP</MenuItem>
                      <MenuItem value="private">Private Limited</MenuItem>
                      <MenuItem value="public">Public Limited</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Business Category"
                      value={businessData.category}
                      onChange={(e) => setBusinessData({ ...businessData, category: e.target.value })}
                      required
                    >
                      <MenuItem value="manufacturing">Manufacturing</MenuItem>
                      <MenuItem value="trading">Trading</MenuItem>
                      <MenuItem value="services">Services</MenuItem>
                      <MenuItem value="retail">Retail</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      value={businessData.pan}
                      onChange={(e) => setBusinessData({ ...businessData, pan: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Business Address"
                      multiline
                      rows={3}
                      value={businessData.address}
                      onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="State"
                      value={businessData.state}
                      onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="District"
                      value={businessData.district}
                      onChange={(e) => setBusinessData({ ...businessData, district: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                      sx={{ borderRadius: 1 }}
                    >
                      Next
                    </Button>
                  </Grid>
                </Grid>
              )}

              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Upload Required Documents
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" fullWidth sx={{ borderRadius: 1 }}>
                        Upload PAN Card
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" fullWidth sx={{ borderRadius: 1 }}>
                        Upload Address Proof
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="outlined" component="label" fullWidth sx={{ borderRadius: 1 }}>
                        Upload Identity Proof
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={() => setActiveStep(0)} sx={{ borderRadius: 1 }}>
                          Back
                        </Button>
                        <Button variant="contained" onClick={() => setActiveStep(2)} sx={{ borderRadius: 1 }}>
                          Next
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeStep === 2 && (
                <Box>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Review Your Application
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Please review all details before submitting
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Button onClick={() => setActiveStep(1)} sx={{ borderRadius: 1 }}>
                        Back
                      </Button>
                      <Button variant="contained" sx={{ borderRadius: 1 }}>
                        Submit Application
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Track Your Application
              </Typography>
              <TextField
                fullWidth
                label="Application Number"
                sx={{ mt: 2, mb: 2 }}
              />
              <Button variant="contained" sx={{ borderRadius: 1 }}>
                Track Status
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Renew Business License
              </Typography>
              <TextField
                fullWidth
                label="License Number"
                sx={{ mt: 2, mb: 2 }}
              />
              <Button variant="contained" sx={{ borderRadius: 1 }}>
                Renew Now
              </Button>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
