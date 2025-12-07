import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
  Divider,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Agriculture, Grass, WaterDrop, LocalAtm, TrendingUp } from '@mui/icons-material';

export default function AgricultureServicesPage() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');

  const schemes = [
    {
      name: 'PM-KISAN',
      description: 'Direct income support of ₹6,000 per year to farmers',
      beneficiaries: '11 Crore+',
      amount: '₹6,000/year',
      eligibility: 'All landholding farmers',
      icon: <LocalAtm />,
      color: '#16A34A',
      website: 'https://pmkisan.gov.in/',
    },
    {
      name: 'PM Fasal Bima Yojana',
      description: 'Crop insurance scheme for farmers',
      beneficiaries: '5.5 Crore+',
      coverage: 'All crops',
      premium: '1.5-5% of sum insured',
      icon: <Agriculture />,
      color: '#0284C7',
      website: 'https://pmfby.gov.in/',
    },
    {
      name: 'Kisan Credit Card',
      description: 'Credit facility for farmers',
      beneficiaries: '7 Crore+',
      credit: 'Up to ₹3 Lakh',
      interest: '4% per annum',
      icon: <LocalAtm />,
      color: '#EA580C',
      website: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc',
    },
    {
      name: 'Soil Health Card',
      description: 'Free soil testing and recommendations',
      coverage: '14 Crore cards issued',
      benefit: 'Optimize fertilizer use',
      icon: <Grass />,
      color: '#7C3AED',
      website: 'https://soilhealth.dac.gov.in/',
    },
    {
      name: 'PM Krishi Sinchai Yojana',
      description: 'Irrigation support scheme',
      subsidy: '90% for drip/sprinkler',
      coverage: 'All states',
      icon: <WaterDrop />,
      color: '#0891B2',
      website: 'https://pmksy.gov.in/',
    },
    {
      name: 'e-NAM',
      description: 'National Agriculture Market platform',
      mandis: '1,000+ integrated',
      benefit: 'Better price discovery',
      icon: <TrendingUp />,
      color: '#DC2626',
      website: 'https://www.enam.gov.in/',
    },
  ];

  const states = [
    'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
    'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
    'Telangana', 'Uttar Pradesh', 'West Bengal',
  ];

  const crops = [
    { name: 'Rice', msp: '₹2,183/quintal', season: 'Kharif' },
    { name: 'Wheat', msp: '₹2,275/quintal', season: 'Rabi' },
    { name: 'Cotton', msp: '₹6,620/quintal', season: 'Kharif' },
    { name: 'Sugarcane', msp: '₹315/quintal', season: 'Year-round' },
    { name: 'Maize', msp: '₹2,090/quintal', season: 'Kharif' },
    { name: 'Pulses', msp: '₹7,000-7,755/quintal', season: 'Both' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Agriculture sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              Agriculture Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mt: 0.5 }}>
              Farmer welfare schemes, crop insurance, and agricultural support
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary.main" fontWeight={700}>11 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">PM-KISAN Beneficiaries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main" fontWeight={700}>₹2.8 Lakh Cr</Typography>
              <Typography variant="body2" color="text.secondary">Annual Budget</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main" fontWeight={700}>7 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">Kisan Credit Cards</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" fontWeight={700}>1,000+</Typography>
              <Typography variant="body2" color="text.secondary">e-NAM Mandis</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Schemes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Major Agriculture Schemes
        </Typography>
        <Grid container spacing={3}>
          {schemes.map((scheme, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: `${scheme.color}15`, borderRadius: 1, color: scheme.color }}>
                      {scheme.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>{scheme.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{scheme.description}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    {scheme.beneficiaries && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Beneficiaries</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.beneficiaries}</Typography>
                      </Box>
                    )}
                    {scheme.amount && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Amount</Typography>
                        <Typography variant="body2" fontWeight={600} color="success.main">{scheme.amount}</Typography>
                      </Box>
                    )}
                    {scheme.coverage && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Coverage</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.coverage}</Typography>
                      </Box>
                    )}
                    {scheme.credit && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Credit Limit</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.credit}</Typography>
                      </Box>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="contained" fullWidth onClick={() => window.open(scheme.website, '_blank')}>
                      Visit Official Website
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* MSP Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Minimum Support Price (MSP) 2024-25
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              {crops.map((crop, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1 }}>
                    <Typography variant="h6" fontWeight={600}>{crop.name}</Typography>
                    <Typography variant="h5" color="primary.main" fontWeight={700} sx={{ my: 1 }}>
                      {crop.msp}
                    </Typography>
                    <Chip label={crop.season} size="small" color="primary" variant="outlined" />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Application Form */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Apply for Scheme
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Select State"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Select Scheme"
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                >
                  {schemes.map((scheme) => (
                    <MenuItem key={scheme.name} value={scheme.name}>{scheme.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Farmer Name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Aadhaar Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Mobile Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Land Area (in acres)" type="number" />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  All applications are processed within 15 working days. You will receive SMS updates on your registered mobile number.
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" size="large" fullWidth>
                  Submit Application
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
