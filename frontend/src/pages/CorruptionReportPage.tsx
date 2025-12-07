import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import { ArrowBack, Report, Upload } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function CorruptionReportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportType: '',
    officerName: '',
    officerDesignation: '',
    department: '',
    location: '',
    incidentDate: '',
    amountInvolved: '',
    description: '',
    witnessDetails: '',
  });

  const reportTypes = [
    'Bribery',
    'Embezzlement',
    'Misuse of Power',
    'Nepotism',
    'Fraud',
    'Asset Disproportionate to Income',
    'Other',
  ];

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:4000/api/corruption/reports', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Corruption report submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mb: 2, borderRadius: 1 }}>
          Back to Dashboard
        </Button>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 1, border: '1px solid #DDDDDD' }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'error.main', pl: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              Report Corruption
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Report corruption cases anonymously and securely
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            Your identity will be kept confidential. All reports are investigated by Anti-Corruption Bureau.
          </Alert>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Report Type</InputLabel>
                  <Select name="reportType" value={formData.reportType} onChange={handleChange}>
                    {reportTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Officer/Official Name"
                  name="officerName"
                  value={formData.officerName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="officerDesignation"
                  value={formData.officerDesignation}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Incident Date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount Involved (₹)"
                  name="amountInvolved"
                  value={formData.amountInvolved}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Detailed Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  helperText="Provide as much detail as possible"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Witness Details (Optional)"
                  name="witnessDetails"
                  value={formData.witnessDetails}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  startIcon={<Report />}
                  sx={{ borderRadius: 1 }}
                >
                  {isLoading ? 'Submitting Report...' : 'Submit Corruption Report'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
