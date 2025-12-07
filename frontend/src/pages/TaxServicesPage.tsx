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
  Tab,
  Tabs,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AccountBalance, Receipt, Calculate, Download, Assessment } from '@mui/icons-material';

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

export default function TaxServicesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');

  const taxServices = [
    {
      name: 'Income Tax e-Filing',
      description: 'File your income tax returns online',
      deadline: '31st July 2024',
      icon: <Receipt />,
      color: '#16A34A',
      link: 'https://www.incometax.gov.in',
    },
    {
      name: 'GST Registration',
      description: 'Register for Goods and Services Tax',
      threshold: '₹40 Lakh turnover',
      icon: <AccountBalance />,
      color: '#0284C7',
      link: 'https://www.gst.gov.in',
    },
    {
      name: 'PAN Card',
      description: 'Apply for Permanent Account Number',
      processing: '15 days',
      icon: <Receipt />,
      color: '#EA580C',
      link: 'https://www.tin-nsdl.com',
    },
    {
      name: 'TDS Returns',
      description: 'File Tax Deducted at Source returns',
      frequency: 'Quarterly',
      icon: <Assessment />,
      color: '#7C3AED',
      link: 'https://www.tdscpc.gov.in',
    },
  ];

  const taxSlabs2024 = [
    { income: 'Up to ₹3 Lakh', oldRegime: 'Nil', newRegime: 'Nil' },
    { income: '₹3 - 6 Lakh', oldRegime: '5%', newRegime: '5%' },
    { income: '₹6 - 9 Lakh', oldRegime: '10%', newRegime: '10%' },
    { income: '₹9 - 12 Lakh', oldRegime: '15%', newRegime: '15%' },
    { income: '₹12 - 15 Lakh', oldRegime: '20%', newRegime: '20%' },
    { income: 'Above ₹15 Lakh', oldRegime: '30%', newRegime: '30%' },
  ];

  const deductionsList = [
    { section: '80C', description: 'PPF, ELSS, Life Insurance', limit: '₹1.5 Lakh' },
    { section: '80D', description: 'Health Insurance Premium', limit: '₹25,000 - ₹1 Lakh' },
    { section: '80E', description: 'Education Loan Interest', limit: 'No Limit' },
    { section: '80G', description: 'Donations to Charity', limit: '50% - 100%' },
    { section: '24(b)', description: 'Home Loan Interest', limit: '₹2 Lakh' },
    { section: 'HRA', description: 'House Rent Allowance', limit: 'As per rules' },
  ];

  const calculateTax = () => {
    if (!income) return null;
    const taxableIncome = parseInt(income) - (parseInt(deductions) || 0);
    let tax = 0;

    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
    else tax = 150000 + (taxableIncome - 1500000) * 0.3;

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {
      taxableIncome,
      tax: Math.round(tax),
      cess: Math.round(cess),
      totalTax: Math.round(totalTax),
    };
  };

  const calculation = calculateTax();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Receipt sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              Tax Services
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pl: 2, mt: 0.5 }}>
              Income tax filing, GST registration, and tax calculation tools
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="primary.main" fontWeight={700}>8.5 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">ITR Filed (2023-24)</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="success.main" fontWeight={700}>1.4 Cr+</Typography>
              <Typography variant="body2" color="text.secondary">GST Registrations</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="info.main" fontWeight={700}>₹3 Lakh</Typography>
              <Typography variant="body2" color="text.secondary">Tax-Free Income</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" color="warning.main" fontWeight={700}>31 July</Typography>
              <Typography variant="body2" color="text.secondary">ITR Deadline</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Tax Calculator" />
          <Tab label="Tax Services" />
          <Tab label="Tax Slabs" />
          <Tab label="Deductions" />
        </Tabs>
      </Box>

      {/* Tax Calculator Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Income Tax Calculator 2024-25</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Income (₹)"
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Total Deductions (₹)"
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                />
              </Grid>
              {calculation && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Taxable Income</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight={700}>
                        ₹{calculation.taxableIncome.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Income Tax</Typography>
                      <Typography variant="h5" color="warning.main" fontWeight={700}>
                        ₹{calculation.tax.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Cess (4%)</Typography>
                      <Typography variant="h5" color="info.main" fontWeight={700}>
                        ₹{calculation.cess.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Total Tax</Typography>
                      <Typography variant="h5" color="error.main" fontWeight={700}>
                        ₹{calculation.totalTax.toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Tax Services Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {taxServices.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: `${service.color}15`, borderRadius: 1, color: service.color }}>
                      {service.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight={600}>{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1}>
                    {service.deadline && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Deadline</Typography>
                        <Chip label={service.deadline} size="small" color="error" />
                      </Box>
                    )}
                    {service.threshold && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Threshold</Typography>
                        <Typography variant="body2" fontWeight={600}>{service.threshold}</Typography>
                      </Box>
                    )}
                    {service.processing && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Processing Time</Typography>
                        <Typography variant="body2" fontWeight={600}>{service.processing}</Typography>
                      </Box>
                    )}
                  </Stack>
                  <Button variant="contained" fullWidth sx={{ mt: 2 }} href={service.link} target="_blank">
                    Access Service
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tax Slabs Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Income Tax Slabs 2024-25</Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #DDD' }}>Income Range</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #DDD' }}>Old Regime</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #DDD' }}>New Regime</th>
                  </tr>
                </thead>
                <tbody>
                  {taxSlabs2024.map((slab, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #EEE' }}>{slab.income}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #EEE' }}>{slab.oldRegime}</td>
                      <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #EEE' }}>{slab.newRegime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
            <Alert severity="info" sx={{ mt: 3 }}>
              Standard deduction of ₹50,000 is available in both regimes. Surcharge applicable for income above ₹50 Lakh.
            </Alert>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Deductions Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {deductionsList.map((deduction, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" fontWeight={600}>Section {deduction.section}</Typography>
                    <Chip label={deduction.limit} color="primary" size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">{deduction.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Alert severity="warning" sx={{ mt: 3 }}>
          Note: Most deductions are not available under the new tax regime. Choose wisely based on your investments.
        </Alert>
      </TabPanel>
    </Container>
  );
}
