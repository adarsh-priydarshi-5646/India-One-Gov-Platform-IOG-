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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Chip,
  Stack,
  Alert,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Favorite,
  AccountBalance,
  CreditCard,
  QrCode2,
  Verified,
  TrendingUp,
  People,
  Code,
} from '@mui/icons-material';

export default function DonatePage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  const predefinedAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const impactAreas = [
    {
      title: 'Platform Development',
      description: 'Build new features and improve existing ones',
      icon: <Code />,
      color: '#0284C7',
      raised: '₹2.5L',
      goal: '₹10L',
      percentage: 25,
    },
    {
      title: 'Infrastructure',
      description: 'Server costs, database, and hosting',
      icon: <AccountBalance />,
      color: '#16A34A',
      raised: '₹1.8L',
      goal: '₹5L',
      percentage: 36,
    },
    {
      title: 'Community Support',
      description: 'Help citizens use the platform effectively',
      icon: <People />,
      color: '#EA580C',
      raised: '₹0.8L',
      goal: '₹3L',
      percentage: 27,
    },
    {
      title: 'Security & Compliance',
      description: 'Ensure data security and privacy',
      icon: <Verified />,
      color: '#7C3AED',
      raised: '₹1.2L',
      goal: '₹4L',
      percentage: 30,
    },
  ];

  const benefits = [
    'Help millions of Indians access government services',
    'Fight corruption through transparency',
    'Bridge the digital divide',
    'Support open-source development',
    'Enable multi-language accessibility',
    'Improve governance efficiency',
  ];

  const handleDonate = () => {
    const finalAmount = amount === 'custom' ? customAmount : amount;
    // Implement payment gateway integration
    console.log('Donation:', { finalAmount, paymentMethod, donorName, donorEmail });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Favorite sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Support India One-Gov Platform
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Help us build a transparent, accessible, and efficient governance platform for every Indian citizen
        </Typography>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight={700}>1M+</Typography>
              <Typography variant="body2" color="text.secondary">Citizens Served</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight={700}>30+</Typography>
              <Typography variant="body2" color="text.secondary">Government Schemes</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" fontWeight={700}>6</Typography>
              <Typography variant="body2" color="text.secondary">Indian Languages</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight={700}>100%</Typography>
              <Typography variant="body2" color="text.secondary">Open Source</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Donation Form */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Make a Donation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your contribution helps us serve millions of Indians better
              </Typography>

              {/* Amount Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Select Amount
                </Typography>
                <Grid container spacing={2}>
                  {predefinedAmounts.map((amt) => (
                    <Grid item xs={4} key={amt}>
                      <Button
                        fullWidth
                        variant={amount === amt.toString() ? 'contained' : 'outlined'}
                        onClick={() => setAmount(amt.toString())}
                        sx={{ py: 1.5 }}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </Button>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant={amount === 'custom' ? 'contained' : 'outlined'}
                      onClick={() => setAmount('custom')}
                    >
                      Custom Amount
                    </Button>
                  </Grid>
                  {amount === 'custom' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Enter Amount (₹)"
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        InputProps={{ inputProps: { min: 10 } }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Payment Method */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Payment Method
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <QrCode2 />
                          <Typography>UPI (Google Pay, PhonePe, Paytm)</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CreditCard />
                          <Typography>Credit/Debit Card</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccountBalance />
                          <Typography>Net Banking</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Donor Information */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Your Information (Optional)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      helperText="For donation receipt and updates"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                Your donation is secure and will be used solely for platform development and maintenance.
              </Alert>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleDonate}
                disabled={!amount || (amount === 'custom' && !customAmount)}
                startIcon={<Favorite />}
              >
                Donate {amount && (amount === 'custom' ? `₹${customAmount}` : `₹${amount}`)}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Impact & Benefits */}
        <Grid item xs={12} md={5}>
          {/* Impact Areas */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Where Your Money Goes
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {impactAreas.map((area, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ color: area.color }}>{area.icon}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>{area.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{area.description}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          flex: 1,
                          height: 8,
                          bgcolor: '#F5F5F5',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${area.percentage}%`,
                            height: '100%',
                            bgcolor: area.color,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" fontWeight={600}>
                        {area.raised} / {area.goal}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Your Impact
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {benefits.map((benefit, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Verified sx={{ fontSize: 20, color: 'success.main', mt: 0.25 }} />
                    <Typography variant="body2">{benefit}</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Tax Benefit */}
          <Paper sx={{ p: 2, mt: 3, bgcolor: 'success.light', color: 'success.dark' }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              💰 Tax Benefits
            </Typography>
            <Typography variant="body2">
              Donations may be eligible for tax deductions under Section 80G of the Income Tax Act.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Donors */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Recent Supporters
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: 'Anonymous', amount: 5000, message: 'Great initiative for India!' },
            { name: 'Rajesh Kumar', amount: 2000, message: 'Supporting transparency' },
            { name: 'Priya Sharma', amount: 1000, message: 'Keep up the good work' },
            { name: 'Anonymous', amount: 10000, message: 'For a better India' },
          ].map((donor, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>₹{donor.amount.toLocaleString('en-IN')}</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary.main">{donor.name}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "{donor.message}"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
