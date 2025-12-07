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
  MenuItem,
} from '@mui/material';
import {
  LocalHospital,
  Vaccines,
  MedicalServices,
  HealthAndSafety,
  CalendarMonth,
} from '@mui/icons-material';

export default function HealthcareServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [appointmentData, setAppointmentData] = useState({
    hospitalType: '',
    department: '',
    date: '',
    time: '',
  });

  const services = [
    { title: 'Book Appointment', icon: <CalendarMonth />, color: '#7C3AED' },
    { title: 'Health Card', icon: <HealthAndSafety />, color: '#2563EB' },
    { title: 'Vaccination', icon: <Vaccines />, color: '#059669' },
    { title: 'Emergency', icon: <MedicalServices />, color: '#DC2626' },
  ];

  const hospitals = [
    { name: 'AIIMS Delhi', type: 'Government', beds: 2500, emergency: true },
    { name: 'Safdarjung Hospital', type: 'Government', beds: 1800, emergency: true },
    { name: 'RML Hospital', type: 'Government', beds: 1200, emergency: true },
    { name: 'GTB Hospital', type: 'Government', beds: 1500, emergency: true },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Healthcare Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access healthcare facilities and book appointments
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

        <Grid container spacing={3}>
          {/* Appointment Booking */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #DDDDDD', borderRadius: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Book Hospital Appointment
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Hospital Type"
                      value={appointmentData.hospitalType}
                      onChange={(e) => setAppointmentData({ ...appointmentData, hospitalType: e.target.value })}
                    >
                      <MenuItem value="government">Government Hospital</MenuItem>
                      <MenuItem value="private">Private Hospital</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Department"
                      value={appointmentData.department}
                      onChange={(e) => setAppointmentData({ ...appointmentData, department: e.target.value })}
                    >
                      <MenuItem value="general">General Medicine</MenuItem>
                      <MenuItem value="cardiology">Cardiology</MenuItem>
                      <MenuItem value="orthopedics">Orthopedics</MenuItem>
                      <MenuItem value="pediatrics">Pediatrics</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="time"
                      label="Time"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" fullWidth sx={{ borderRadius: 1 }}>
                      Book Appointment
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Nearby Hospitals */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #DDDDDD', borderRadius: 1 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Nearby Government Hospitals
              </Typography>
              <Box sx={{ mt: 2 }}>
                {hospitals.map((hospital, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    sx={{ mb: 2, border: '1px solid #DDDDDD', borderRadius: 1 }}
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight={600}>
                        {hospital.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Beds: {hospital.beds}
                        </Typography>
                        {hospital.emergency && (
                          <Typography variant="caption" color="error.main" fontWeight={600}>
                            24/7 Emergency
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
