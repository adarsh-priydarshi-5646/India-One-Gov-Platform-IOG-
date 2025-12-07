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
  Tab,
  Tabs,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Diversity3, AccountBalance, ChildCare, Elderly, WaterDrop, LocalGasStation } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SocialWelfareServicesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [selectedScheme, setSelectedScheme] = useState('');

  const welfareSchemes = [
    {
      category: 'Financial Inclusion',
      schemes: [
        {
          name: 'PM Jan Dhan Yojana',
          description: 'Zero balance bank account with insurance',
          beneficiaries: '50 Crore+',
          benefit: '₹2 Lakh accident insurance',
          icon: <AccountBalance />,
          color: '#16A34A',
        },
        {
          name: 'PM Ujjwala Yojana',
          description: 'Free LPG connection to BPL families',
          beneficiaries: '9.59 Crore',
          benefit: 'Free gas connection + ₹1,600 subsidy',
          icon: <LocalGasStation />,
          color: '#EA580C',
        },
      ],
    },
    {
      category: 'Women & Child Welfare',
      schemes: [
        {
          name: 'Beti Bachao Beti Padhao',
          description: 'Girl child education and empowerment',
          coverage: 'All districts',
          benefit: 'Education support + awareness',
          icon: <ChildCare />,
          color: '#EC4899',
        },
        {
          name: 'Pradhan Mantri Matru Vandana Yojana',
          description: 'Maternity benefit scheme',
          benefit: '₹5,000 cash incentive',
          beneficiaries: '1.5 Crore+',
          icon: <Diversity3 />,
          color: '#8B5CF6',
        },
      ],
    },
    {
      category: 'Sanitation & Water',
      schemes: [
        {
          name: 'Swachh Bharat Mission',
          description: 'Clean India campaign',
          achievement: '11 Crore toilets built',
          coverage: '100% ODF villages',
          icon: <WaterDrop />,
          color: '#0891B2',
        },
        {
          name: 'Jal Jeevan Mission',
          description: 'Tap water to every household',
          target: '19 Crore households',
          coverage: '14 Crore+ connected',
          icon: <WaterDrop />,
          color: '#0284C7',
        },
      ],
    },
    {
      category: 'Senior Citizens',
      schemes: [
        {
          name: 'Indira Gandhi National Old Age Pension',
          description: 'Monthly pension for senior citizens',
          benefit: '₹200-500/month',
          eligibility: '60+ years, BPL',
          icon: <Elderly />,
          color: '#7C3AED',
        },
        {
          name: 'Senior Citizen Savings Scheme',
          description: 'High interest savings for seniors',
          interest: '8.2% per annum',
          maxDeposit: '₹30 Lakh',
          icon: <AccountBalance />,
          color: '#DC2626',
        },
      ],
    },
  ];

  const statistics = [
    { label: 'Jan Dhan Accounts', value: '50 Cr+', color: 'primary.main' },
    { label: 'Ujjwala Beneficiaries', value: '9.59 Cr', color: 'success.main' },
    { label: 'Toilets Built', value: '11 Cr', color: 'info.main' },
    { label: 'Tap Connections', value: '14 Cr+', color: 'warning.main' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Diversity3 sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              Social Welfare Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mt: 0.5 }}>
              Government schemes for financial inclusion, women empowerment, and social security
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statistics.map((stat, index) => (
          <Grid item xs={12} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h4" color={stat.color} fontWeight={700}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          {welfareSchemes.map((category, index) => (
            <Tab key={index} label={category.category} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {welfareSchemes.map((category, catIndex) => (
        <TabPanel key={catIndex} value={tabValue} index={catIndex}>
          <Grid container spacing={3}>
            {category.schemes.map((scheme, schemeIndex) => (
              <Grid item xs={12} md={6} key={schemeIndex}>
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
                      {scheme.benefit && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Benefit</Typography>
                          <Typography variant="body2" fontWeight={600} color="success.main">{scheme.benefit}</Typography>
                        </Box>
                      )}
                      {scheme.coverage && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Coverage</Typography>
                          <Typography variant="body2" fontWeight={600}>{scheme.coverage}</Typography>
                        </Box>
                      )}
                      {scheme.achievement && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Achievement</Typography>
                          <Typography variant="body2" fontWeight={600}>{scheme.achievement}</Typography>
                        </Box>
                      )}
                      {scheme.eligibility && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Eligibility</Typography>
                          <Typography variant="body2" fontWeight={600}>{scheme.eligibility}</Typography>
                        </Box>
                      )}
                    </Stack>
                    <Button variant="contained" fullWidth sx={{ mt: 2 }}>Check Eligibility</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      ))}

      {/* Application Form */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
          Apply for Welfare Scheme
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Select Scheme"
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                >
                  {welfareSchemes.flatMap(cat => cat.schemes).map((scheme) => (
                    <MenuItem key={scheme.name} value={scheme.name}>{scheme.name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Applicant Name" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Aadhaar Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Mobile Number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Annual Income" type="number" />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="OBC">OBC</MenuItem>
                  <MenuItem value="SC">SC</MenuItem>
                  <MenuItem value="ST">ST</MenuItem>
                  <MenuItem value="EWS">EWS</MenuItem>
                </TextField>
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
