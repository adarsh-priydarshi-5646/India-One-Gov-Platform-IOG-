import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Report, Send, ArrowBack, ArrowForward, Security } from '@mui/icons-material';
import { INDIAN_STATES, getDistrictsByState } from '@/data/indiaLocations';
import axios from 'axios';
import { toast } from 'react-toastify';

const CRIME_TYPES = [
  'THEFT',
  'ROBBERY',
  'ASSAULT',
  'MURDER',
  'KIDNAPPING',
  'FRAUD',
  'CYBERCRIME',
  'DOMESTIC_VIOLENCE',
  'RAPE',
  'BURGLARY',
  'VEHICLE_THEFT',
  'OTHER',
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const steps = ['Incident Details', 'Location & Police Station', 'Review & Submit'];

export default function FileFIRPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [districts, setDistricts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    reporterName: user?.fullName || '',
    reporterContact: user?.phoneNumber || '',
    crimeType: '',
    description: '',
    incidentDate: '',
    incidentTime: '',
    locationLat: 19.076,
    locationLng: 72.8777,
    address: '',
    state: '',
    district: '',
    policeStation: '',
    priority: 'MEDIUM',
  });

  React.useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsByState(formData.state);
      setDistricts(stateDistricts);
    }
  }, [formData.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:4000/api/crime/firs',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const firNumber = response.data.data.firNumber;
      setSuccess(`FIR filed successfully! FIR Number: ${firNumber}`);
      toast.success(`FIR filed successfully! FIR Number: ${firNumber}`);
      
      setTimeout(() => {
        navigate('/firs');
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error?.message || 'Failed to file FIR';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reporter Name"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                name="reporterContact"
                value={formData.reporterContact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Crime Type"
                name="crimeType"
                value={formData.crimeType}
                onChange={handleChange}
                required
              >
                {CRIME_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                {PRIORITIES.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
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
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="time"
                label="Incident Time"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description of Incident"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed description of the incident..."
                required
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Incident Location Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete address where incident occurred"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select name="state" value={formData.state} label="State" onChange={handleChange}>
                  {INDIAN_STATES.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.state}>
                <InputLabel>District</InputLabel>
                <Select name="district" value={formData.district} label="District" onChange={handleChange}>
                  {districts.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Police Station"
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
                placeholder="Enter nearest police station name"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Location coordinates will be automatically captured if you allow location access
              </Alert>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please review your information before submitting the FIR.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Reporter Name
                </Typography>
                <Typography variant="body1">{formData.reporterName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Crime Type
                </Typography>
                <Typography variant="body1">{formData.crimeType.replace('_', ' ')}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Incident Date & Time
                </Typography>
                <Typography variant="body1">
                  {formData.incidentDate} {formData.incidentTime && `at ${formData.incidentTime}`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {formData.address}, {formData.district}, {formData.state}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Police Station
                </Typography>
                <Typography variant="body1">{formData.policeStation}</Typography>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/firs')} sx={{ mb: 2, borderRadius: 1 }}>
          Back to FIRs
        </Button>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 1, border: '1px solid #DDDDDD' }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'error.main', pl: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              {t('fir.fileFIR')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              File First Information Report (FIR) to report a crime incident
            </Typography>
          </Box>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            Important Notice
          </Typography>
          Filing a false FIR is a punishable offense. Please provide accurate information.
        </Alert>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0 || isLoading}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              size="large"
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                >
                  {isLoading ? 'Submitting...' : 'Submit FIR'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      </Container>
    </Box>
  );
}
