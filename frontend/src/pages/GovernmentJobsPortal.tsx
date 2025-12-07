import { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Tabs,
  Tab,
  LinearProgress,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Business,
  School,
  TrendingUp,
  People,
  CheckCircle,
  Schedule,
  Psychology,
  Assessment,
  Train,
  AccountBalance,
  Shield,
  Security,
  MenuBook,
  LocalHospital,
  Mail,
} from '@mui/icons-material';

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

export default function GovernmentJobsPortal() {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedQualification, setSelectedQualification] = useState('ALL');

  // Government Job Statistics
  const stats = {
    totalVacancies: 125000,
    activeRecruitments: 450,
    placementRate: 67,
    sectorsHiring: 28,
  };

  // Government Sectors with icons
  const sectors = [
    { name: 'Railways', vacancies: 35000, icon: <Train sx={{ fontSize: 40 }} /> },
    { name: 'Banking', vacancies: 25000, icon: <AccountBalance sx={{ fontSize: 40 }} /> },
    { name: 'Defense', vacancies: 20000, icon: <Shield sx={{ fontSize: 40 }} /> },
    { name: 'Police', vacancies: 15000, icon: <Security sx={{ fontSize: 40 }} /> },
    { name: 'Education', vacancies: 12000, icon: <MenuBook sx={{ fontSize: 40 }} /> },
    { name: 'Healthcare', vacancies: 10000, icon: <LocalHospital sx={{ fontSize: 40 }} /> },
    { name: 'Post Office', vacancies: 5000, icon: <Mail sx={{ fontSize: 40 }} /> },
    { name: 'Other', vacancies: 3000, icon: <Business sx={{ fontSize: 40 }} /> },
  ];

  // Government Jobs with Eligibility
  const governmentJobs = [
    {
      id: 1,
      title: 'Railway Recruitment Board - Group D',
      organization: 'Indian Railways',
      department: 'Ministry of Railways',
      vacancies: 35000,
      location: 'All India',
      salary: '₹18,000 - ₹56,900',
      qualification: '10th Pass',
      ageLimit: '18-33 years',
      examDate: '2024-03-15',
      applicationDeadline: '2024-02-28',
      status: 'Active',
      sector: 'Railways',
      eligibility: {
        education: '10th Pass',
        age: '18-33 years',
        nationality: 'Indian',
        experience: 'Not Required',
      },
      selectionProcess: ['Written Exam', 'Physical Test', 'Document Verification'],
      benefits: ['Pension', 'Medical', 'Travel Allowance', 'Housing'],
    },
    {
      id: 2,
      title: 'IBPS - Probationary Officer',
      organization: 'Institute of Banking Personnel Selection',
      department: 'Banking Sector',
      vacancies: 4000,
      location: 'All India',
      salary: '₹23,700 - ₹42,020',
      qualification: 'Graduate',
      ageLimit: '20-30 years',
      examDate: '2024-04-20',
      applicationDeadline: '2024-03-15',
      status: 'Active',
      sector: 'Banking',
      eligibility: {
        education: 'Graduate in any discipline',
        age: '20-30 years',
        nationality: 'Indian',
        experience: 'Not Required',
      },
      selectionProcess: ['Prelims', 'Mains', 'Interview'],
      benefits: ['Pension', 'Medical', 'HRA', 'DA'],
    },
    {
      id: 3,
      title: 'SSC - Combined Graduate Level',
      organization: 'Staff Selection Commission',
      department: 'Various Ministries',
      vacancies: 8000,
      location: 'All India',
      salary: '₹25,500 - ₹81,100',
      qualification: 'Graduate',
      ageLimit: '18-32 years',
      examDate: '2024-05-10',
      applicationDeadline: '2024-04-05',
      status: 'Active',
      sector: 'Central Government',
      eligibility: {
        education: 'Graduate',
        age: '18-32 years',
        nationality: 'Indian',
        experience: 'Not Required',
      },
      selectionProcess: ['Tier 1', 'Tier 2', 'Tier 3', 'Document Verification'],
      benefits: ['Pension', 'Medical', 'LTC', 'HRA'],
    },
    {
      id: 4,
      title: 'State Police Constable',
      organization: 'State Police Department',
      department: 'Home Ministry',
      vacancies: 15000,
      location: 'State-wise',
      salary: '₹21,700 - ₹69,100',
      qualification: '12th Pass',
      ageLimit: '18-25 years',
      examDate: '2024-03-25',
      applicationDeadline: '2024-02-20',
      status: 'Active',
      sector: 'Police',
      eligibility: {
        education: '12th Pass',
        age: '18-25 years',
        nationality: 'Indian',
        experience: 'Not Required',
        physical: 'Height: 165cm (Male), 150cm (Female)',
      },
      selectionProcess: ['Written Exam', 'Physical Test', 'Medical Test'],
      benefits: ['Pension', 'Medical', 'Uniform Allowance'],
    },
  ];

  // AI Recommendations based on user profile
  const aiRecommendations = [
    {
      job: 'Railway Group D',
      matchScore: 95,
      reason: 'Your 10th qualification matches perfectly',
    },
    {
      job: 'SSC CGL',
      matchScore: 88,
      reason: 'Graduate degree makes you eligible',
    },
    {
      job: 'Police Constable',
      matchScore: 82,
      reason: 'Age and education criteria met',
    },
  ];

  // Upcoming Recruitments
  const upcomingRecruitments = [
    { organization: 'UPSC', exam: 'Civil Services', month: 'June 2024', vacancies: 1000 },
    { organization: 'RRB', exam: 'NTPC', month: 'July 2024', vacancies: 35000 },
    { organization: 'SSC', exam: 'CHSL', month: 'August 2024', vacancies: 5000 },
    { organization: 'IBPS', exam: 'Clerk', month: 'September 2024', vacancies: 7000 },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Government Jobs Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find government jobs and apply online
            </Typography>
          </Box>
        </Box>

      {/* Statistics Dashboard */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Work sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {stats.totalVacancies.toLocaleString()}
            </Typography>
            <Typography variant="caption">Total Vacancies</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.main', color: 'white' }}>
            <Business sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {stats.activeRecruitments}
            </Typography>
            <Typography variant="caption">Active Recruitments</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <TrendingUp sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {stats.placementRate}%
            </Typography>
            <Typography variant="caption">Placement Rate</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <Assessment sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              {stats.sectorsHiring}
            </Typography>
            <Typography variant="caption">Sectors Hiring</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable">
          <Tab label="All Jobs" icon={<Work />} iconPosition="start" />
          <Tab label="AI Recommendations" icon={<Psychology />} iconPosition="start" />
          <Tab label="Sectors" icon={<Business />} iconPosition="start" />
          <Tab label="Upcoming" icon={<Schedule />} iconPosition="start" />
          <Tab label="Eligibility Check" icon={<CheckCircle />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab 1: All Jobs */}
      <TabPanel value={tabValue} index={0}>
        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by job title, organization, or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sector</InputLabel>
                <Select
                  value={selectedSector}
                  label="Sector"
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  <MenuItem value="ALL">All Sectors</MenuItem>
                  <MenuItem value="Railways">Railways</MenuItem>
                  <MenuItem value="Banking">Banking</MenuItem>
                  <MenuItem value="Police">Police</MenuItem>
                  <MenuItem value="Defense">Defense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Qualification</InputLabel>
                <Select
                  value={selectedQualification}
                  label="Qualification"
                  onChange={(e) => setSelectedQualification(e.target.value)}
                >
                  <MenuItem value="ALL">All Qualifications</MenuItem>
                  <MenuItem value="10th">10th Pass</MenuItem>
                  <MenuItem value="12th">12th Pass</MenuItem>
                  <MenuItem value="Graduate">Graduate</MenuItem>
                  <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Job Listings */}
        <Grid container spacing={3}>
          {governmentJobs.map((job) => (
            <Grid item xs={12} key={job.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Box display="flex" gap={2} mb={2}>
                        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                          <Business sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {job.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.organization}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {job.department}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
                        <Chip icon={<Work />} label={`${job.vacancies} Vacancies`} color="primary" />
                        <Chip icon={<LocationOn />} label={job.location} />
                        <Chip icon={<School />} label={job.qualification} />
                        <Chip label={job.ageLimit} />
                        <Chip label={job.status} color="success" />
                      </Stack>

                      <Box mb={2}>
                        <Typography variant="body2" fontWeight={600} gutterBottom>
                          Salary: {job.salary}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Exam Date: {new Date(job.examDate).toLocaleDateString()}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" fontWeight={600}>
                          Selection Process:
                        </Typography>
                        <Stack direction="row" spacing={1} mt={0.5}>
                          {job.selectionProcess.map((step, idx) => (
                            <Chip key={idx} label={step} size="small" variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Eligibility Criteria
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Stack spacing={1}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Education:
                            </Typography>
                            <Typography variant="body2">{job.eligibility.education}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Age:
                            </Typography>
                            <Typography variant="body2">{job.eligibility.age}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Experience:
                            </Typography>
                            <Typography variant="body2">{job.eligibility.experience}</Typography>
                          </Box>
                          {job.eligibility.physical && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Physical:
                              </Typography>
                              <Typography variant="body2">{job.eligibility.physical}</Typography>
                            </Box>
                          )}
                        </Stack>
                        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                          Check Eligibility
                        </Button>
                        <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                          Apply Now
                        </Button>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 2: AI Recommendations */}
      <TabPanel value={tabValue} index={1}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            AI-Powered Job Matching
          </Typography>
          Based on your profile, education, and preferences, we recommend these jobs for you.
        </Alert>

        <Grid container spacing={3}>
          {aiRecommendations.map((rec, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Psychology color="primary" sx={{ fontSize: 40 }} />
                    <Chip label={`${rec.matchScore}% Match`} color="success" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {rec.job}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {rec.reason}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={rec.matchScore}
                    sx={{ mb: 2, height: 8, borderRadius: 4 }}
                  />
                  <Button variant="contained" fullWidth>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 3: Sectors */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {sectors.map((sector, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                elevation={0}
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      mb: 2,
                    }}
                  >
                    {sector.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {sector.name}
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight={700}>
                    {sector.vacancies.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Vacancies Available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 4: Upcoming Recruitments */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {upcomingRecruitments.map((rec, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {rec.exam}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rec.organization}
                      </Typography>
                    </Box>
                    <Chip label={rec.month} color="primary" />
                  </Box>
                  <Typography variant="h5" color="secondary" fontWeight={700}>
                    {rec.vacancies.toLocaleString()} Vacancies
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Set Reminder
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 5: Eligibility Check */}
      <TabPanel value={tabValue} index={4}>
        <Paper sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom textAlign="center">
            Check Your Eligibility
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Answer a few questions to find jobs you're eligible for
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Highest Qualification</InputLabel>
              <Select label="Highest Qualification">
                <MenuItem value="10th">10th Pass</MenuItem>
                <MenuItem value="12th">12th Pass</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Post Graduate">Post Graduate</MenuItem>
              </Select>
            </FormControl>

            <TextField fullWidth label="Your Age" type="number" />

            <FormControl fullWidth>
              <InputLabel>Preferred Sector</InputLabel>
              <Select label="Preferred Sector">
                <MenuItem value="Railways">Railways</MenuItem>
                <MenuItem value="Banking">Banking</MenuItem>
                <MenuItem value="Police">Police</MenuItem>
                <MenuItem value="Defense">Defense</MenuItem>
                <MenuItem value="Any">Any Sector</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Preferred Location</InputLabel>
              <Select label="Preferred Location">
                <MenuItem value="All India">All India</MenuItem>
                <MenuItem value="Home State">Home State Only</MenuItem>
                <MenuItem value="Metro Cities">Metro Cities</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" size="large" fullWidth>
              Find Eligible Jobs
            </Button>
          </Stack>
        </Paper>
      </TabPanel>
      </Container>
    </Box>
  );
}
