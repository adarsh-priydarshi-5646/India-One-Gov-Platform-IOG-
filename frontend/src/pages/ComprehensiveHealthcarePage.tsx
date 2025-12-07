import { useState, useEffect } from 'react';
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
  Tabs,
  Tab,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  LocalHospital,
  LocationOn,
  Phone,
  CheckCircle,
  Pending,
  Cancel,
  TrendingUp,
  Notifications,
} from '@mui/icons-material';
import { INDIAN_STATES } from '@/config/constants';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>;
}

export default function ComprehensiveHealthcarePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [hospitals, setHospitals] = useState<any[]>([]);

  // Government Healthcare Schemes
  const schemes = [
    {
      name: 'Ayushman Bharat - PM-JAY',
      coverage: '₹5 Lakh per family',
      beneficiaries: '50 Crore',
      status: 'Active',
      launched: '2018',
    },
    {
      name: 'Pradhan Mantri Swasthya Suraksha Yojana',
      coverage: 'AIIMS & Medical Colleges',
      beneficiaries: 'All Citizens',
      status: 'Active',
      launched: '2003',
    },
    {
      name: 'National Health Mission',
      coverage: 'Primary Healthcare',
      beneficiaries: 'Rural & Urban',
      status: 'Active',
      launched: '2013',
    },
    {
      name: 'Janani Suraksha Yojana',
      coverage: 'Maternal Health',
      beneficiaries: 'Pregnant Women',
      status: 'Active',
      launched: '2005',
    },
  ];

  // Government Promises Tracking
  const promises = [
    {
      promise: 'Universal Health Coverage by 2025',
      status: 'In Progress',
      completion: 65,
      target: '2025',
    },
    {
      promise: '1.5 Lakh Health & Wellness Centers',
      status: 'In Progress',
      completion: 78,
      target: '2024',
      achieved: '1,17,000',
      total: '1,50,000',
    },
    {
      promise: 'Digital Health ID for all citizens',
      status: 'In Progress',
      completion: 45,
      target: '2025',
      achieved: '45 Crore',
      total: '100 Crore',
    },
    {
      promise: 'Free COVID-19 Vaccination',
      status: 'Completed',
      completion: 100,
      target: '2023',
      achieved: '220 Crore doses',
    },
  ];

  // Latest Notifications
  const notifications = [
    {
      title: 'New Ayushman Bharat Cards Distribution',
      date: '2024-12-01',
      type: 'Scheme',
      priority: 'High',
    },
    {
      title: 'Free Health Checkup Camps in Rural Areas',
      date: '2024-11-28',
      type: 'Service',
      priority: 'Medium',
    },
    {
      title: 'Telemedicine Services Expanded',
      date: '2024-11-25',
      type: 'Service',
      priority: 'High',
    },
    {
      title: 'New Medical Colleges Approved',
      date: '2024-11-20',
      type: 'Infrastructure',
      priority: 'Medium',
    },
  ];

  // Sample Government Hospitals Data (State-wise)
  const governmentHospitals: Record<string, any[]> = {
    'Delhi': [
      { name: 'AIIMS Delhi', district: 'South Delhi', block: 'Ansari Nagar', beds: 2500, emergency: true, specialties: ['Cardiology', 'Neurology', 'Oncology'] },
      { name: 'Safdarjung Hospital', district: 'South Delhi', block: 'Safdarjung', beds: 1800, emergency: true, specialties: ['General Medicine', 'Surgery'] },
      { name: 'RML Hospital', district: 'Central Delhi', block: 'Connaught Place', beds: 1200, emergency: true, specialties: ['General Medicine', 'Pediatrics'] },
      { name: 'GTB Hospital', district: 'East Delhi', block: 'Dilshad Garden', beds: 1500, emergency: true, specialties: ['Trauma', 'Emergency'] },
      { name: 'Lady Hardinge Medical College', district: 'Central Delhi', block: 'Connaught Place', beds: 800, emergency: true, specialties: ['Gynecology', 'Pediatrics'] },
    ],
    'Maharashtra': [
      { name: 'KEM Hospital Mumbai', district: 'Mumbai', block: 'Parel', beds: 2200, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'JJ Hospital Mumbai', district: 'Mumbai', block: 'Byculla', beds: 1800, emergency: true, specialties: ['General Medicine'] },
      { name: 'Sassoon Hospital Pune', district: 'Pune', block: 'Pune Central', beds: 1500, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'Nair Hospital Mumbai', district: 'Mumbai', block: 'Mumbai Central', beds: 1400, emergency: true, specialties: ['General Medicine', 'Surgery'] },
    ],
    'Karnataka': [
      { name: 'Victoria Hospital Bangalore', district: 'Bangalore Urban', block: 'Fort', beds: 1800, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'Bowring Hospital Bangalore', district: 'Bangalore Urban', block: 'Shivajinagar', beds: 900, emergency: true, specialties: ['General Medicine'] },
      { name: 'KC General Hospital Bangalore', district: 'Bangalore Urban', block: 'Malleshwaram', beds: 1200, emergency: true, specialties: ['Multi-specialty'] },
    ],
    'Tamil Nadu': [
      { name: 'Government General Hospital Chennai', district: 'Chennai', block: 'Park Town', beds: 2800, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'Rajiv Gandhi Government Hospital', district: 'Chennai', block: 'Perungudi', beds: 2000, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'Stanley Medical College', district: 'Chennai', block: 'Royapuram', beds: 1500, emergency: true, specialties: ['General Medicine', 'Surgery'] },
    ],
    'Uttar Pradesh': [
      { name: 'King George Medical University', district: 'Lucknow', block: 'Chowk', beds: 2200, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'BRD Medical College', district: 'Gorakhpur', block: 'Medical College', beds: 1800, emergency: true, specialties: ['Multi-specialty'] },
    ],
    'West Bengal': [
      { name: 'SSKM Hospital Kolkata', district: 'Kolkata', block: 'Bhowanipore', beds: 2300, emergency: true, specialties: ['Multi-specialty'] },
      { name: 'RG Kar Medical College', district: 'Kolkata', block: 'Belgachia', beds: 1600, emergency: true, specialties: ['General Medicine'] },
    ],
  };

  const districts: Record<string, string[]> = {
    'Delhi': ['Central Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'North Delhi'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    'Karnataka': ['Bangalore Urban', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Gorakhpur', 'Agra', 'Varanasi'],
    'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri', 'Durgapur'],
  };

  useEffect(() => {
    if (selectedState && governmentHospitals[selectedState]) {
      let filteredHospitals = governmentHospitals[selectedState];
      if (selectedDistrict && selectedDistrict !== '') {
        filteredHospitals = filteredHospitals.filter(h => h.district === selectedDistrict);
      }
      setHospitals(filteredHospitals);
    } else {
      setHospitals([]);
    }
  }, [selectedState, selectedDistrict]);

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Healthcare Services Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete healthcare information, hospitals, schemes, and government promises
            </Typography>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Total Government Hospitals
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#16A34A">
                25,778
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Active Health Schemes
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#2563EB">
                48
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Beneficiaries Covered
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#D97706">
                50 Cr+
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FCE7F3', border: '1px solid #FBCFE8', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Health & Wellness Centers
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#DB2777">
                1.17 L
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Tabs */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="Find Hospitals" />
            <Tab label="Health Schemes" />
            <Tab label="Government Promises" />
            <Tab label="Notifications" />
          </Tabs>

          {/* Tab 1: Find Hospitals */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Select State"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {INDIAN_STATES.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    label="Select District"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState}
                  >
                    <MenuItem value="">All Districts</MenuItem>
                    {selectedState && districts[selectedState]?.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button variant="contained" fullWidth sx={{ height: 56, borderRadius: 1 }}>
                    Search Hospitals
                  </Button>
                </Grid>
              </Grid>

              {hospitals.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Government Hospitals in {selectedState}
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {hospitals.map((hospital, index) => (
                      <Grid item xs={12} key={index}>
                        <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box>
                                <Typography variant="h6" fontWeight={600}>
                                  {hospital.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOn fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                      {hospital.district}, {hospital.block}
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    Beds: {hospital.beds}
                                  </Typography>
                                  {hospital.emergency && (
                                    <Chip label="24/7 Emergency" size="small" color="error" />
                                  )}
                                </Box>
                                <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  {hospital.specialties.map((specialty: string, idx: number) => (
                                    <Chip key={idx} label={specialty} size="small" variant="outlined" />
                                  ))}
                                </Box>
                              </Box>
                              <Button variant="outlined" size="small" sx={{ borderRadius: 1 }}>
                                Book Appointment
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* Tab 2: Health Schemes */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Active Government Health Schemes
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {schemes.map((scheme, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {scheme.name}
                          </Typography>
                          <Chip label={scheme.status} size="small" color="success" />
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Coverage
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scheme.coverage}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Beneficiaries
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scheme.beneficiaries}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Launched
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scheme.launched}
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

          {/* Tab 3: Government Promises */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Healthcare Promises Tracking
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Track government promises and their completion status
              </Typography>
              <Grid container spacing={2}>
                {promises.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {item.promise}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={item.status === 'Completed' ? 'success' : 'warning'}
                                icon={item.status === 'Completed' ? <CheckCircle /> : <Pending />}
                              />
                              <Typography variant="body2" color="text.secondary">
                                Target: {item.target}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  Progress: {item.completion}%
                                </Typography>
                                {item.achieved && (
                                  <Typography variant="body2" color="text.secondary">
                                    {item.achieved} / {item.total}
                                  </Typography>
                                )}
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={item.completion}
                                sx={{ height: 8, borderRadius: 1 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 4: Notifications */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Latest Healthcare Notifications
              </Typography>
              <List sx={{ mt: 2 }}>
                {notifications.map((notification, index) => (
                  <Box key={index}>
                    <ListItem
                      sx={{
                        border: '1px solid #DDDDDD',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: '#F9FAFB' },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: notification.priority === 'High' ? '#FEE2E2' : '#FEF3C7',
                          color: notification.priority === 'High' ? '#DC2626' : '#D97706',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Notifications />
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={600}>
                            {notification.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {notification.date}
                            </Typography>
                            <Chip label={notification.type} size="small" />
                            <Chip
                              label={notification.priority}
                              size="small"
                              color={notification.priority === 'High' ? 'error' : 'warning'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
