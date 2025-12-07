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
  LinearProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AccountBalance, Elderly, TrendingUp, Calculate } from '@mui/icons-material';

export default function PensionServicesPage() {
  const { t } = useTranslation();
  const [age, setAge] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('');

  const pensionSchemes = [
    {
      name: 'Atal Pension Yojana (APY)',
      description: 'Guaranteed pension for unorganized sector',
      beneficiaries: '6.5 Crore+',
      pension: '₹1,000 - ₹5,000/month',
      eligibility: '18-40 years',
      contribution: '₹42 - ₹1,454/month',
      icon: <AccountBalance />,
      color: '#16A34A',
      features: ['Guaranteed pension', 'Government co-contribution', 'Nominee benefit'],
      website: 'https://www.npscra.nsdl.co.in/scheme-details.php',
    },
    {
      name: 'National Pension System (NPS)',
      description: 'Market-linked retirement savings',
      subscribers: '7.5 Crore+',
      returns: '9-12% annually',
      eligibility: '18-70 years',
      minContribution: '₹500/month',
      icon: <TrendingUp />,
      color: '#0284C7',
      features: ['Tax benefits u/s 80C', 'Market-linked returns', 'Flexible withdrawals'],
      website: 'https://www.npscra.nsdl.co.in/',
    },
    {
      name: 'PM Shram Yogi Maandhan',
      description: 'Pension for unorganized workers',
      beneficiaries: '50 Lakh+',
      pension: '₹3,000/month',
      eligibility: '18-40 years, income < ₹15,000',
      contribution: '₹55 - ₹200/month',
      icon: <Elderly />,
      color: '#EA580C',
      features: ['Fixed pension', 'Low contribution', 'Family pension'],
      website: 'https://maandhan.in/',
    },
    {
      name: 'Employees Provident Fund (EPF)',
      description: 'Retirement fund for salaried employees',
      subscribers: '6 Crore+',
      interest: '8.15% per annum',
      contribution: '12% of basic salary',
      icon: <AccountBalance />,
      color: '#7C3AED',
      features: ['Employer contribution', 'Tax-free interest', 'Loan facility'],
      website: 'https://www.epfindia.gov.in/',
    },
  ];

  const calculatePension = () => {
    if (!age || !monthlyContribution) return null;
    const years = 60 - parseInt(age);
    const totalContribution = parseInt(monthlyContribution) * 12 * years;
    const estimatedCorpus = totalContribution * 2.5; // Simplified calculation
    const monthlyPension = estimatedCorpus / 240; // 20 years payout
    return {
      totalContribution,
      estimatedCorpus,
      monthlyPension: Math.round(monthlyPension),
    };
  };

  const calculation = calculatePension();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              Pension Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mt: 0.5 }}>
              Retirement planning and pension schemes for secure future
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary.main" fontWeight={700}>7.5 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">NPS Subscribers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main" fontWeight={700}>6.5 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">APY Beneficiaries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main" fontWeight={700}>₹10 Lakh Cr</Typography>
              <Typography variant="body2" color="text.secondary">Total AUM</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" fontWeight={700}>8.15%</Typography>
              <Typography variant="body2" color="text.secondary">EPF Interest Rate</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pension Calculator */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Pension Calculator
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Your Current Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  InputProps={{ inputProps: { min: 18, max: 60 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Monthly Contribution (₹)"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="contained" fullWidth sx={{ height: 56 }}>
                  <Calculate sx={{ mr: 1 }} /> Calculate
                </Button>
              </Grid>
              {calculation && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Total Contribution</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight={700}>
                        ₹{calculation.totalContribution.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Estimated Corpus at 60</Typography>
                      <Typography variant="h5" color="success.main" fontWeight={700}>
                        ₹{calculation.estimatedCorpus.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Monthly Pension</Typography>
                      <Typography variant="h5" color="info.main" fontWeight={700}>
                        ₹{calculation.monthlyPension.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Pension Schemes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Available Pension Schemes
        </Typography>
        <Grid container spacing={3}>
          {pensionSchemes.map((scheme, index) => (
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
                  <Stack spacing={1.5}>
                    {scheme.beneficiaries && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Beneficiaries</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.beneficiaries}</Typography>
                      </Box>
                    )}
                    {scheme.pension && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Pension Amount</Typography>
                        <Typography variant="body2" fontWeight={600} color="success.main">{scheme.pension}</Typography>
                      </Box>
                    )}
                    {scheme.eligibility && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Eligibility</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.eligibility}</Typography>
                      </Box>
                    )}
                    {scheme.contribution && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Contribution</Typography>
                        <Typography variant="body2" fontWeight={600}>{scheme.contribution}</Typography>
                      </Box>
                    )}
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Key Features</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                      {scheme.features.map((feature, idx) => (
                        <Chip key={idx} label={feature} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => window.open(scheme.website, '_blank')}
                  >
                    Visit Official Website
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Application Form */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Apply for Pension Scheme
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Select Pension Scheme"
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                >
                  {pensionSchemes.map((scheme) => (
                    <MenuItem key={scheme.name} value={scheme.name}>{scheme.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Full Name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Aadhaar Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="PAN Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Mobile Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Bank Account Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="IFSC Code" />
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
