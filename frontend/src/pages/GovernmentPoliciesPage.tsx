import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import {
  Policy,
  TrendingUp,
  CheckCircle,
  Pending,
  Search,
  FilterList,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>;
}

export default function GovernmentPoliciesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Healthcare', 'Education', 'Employment', 'Infrastructure', 'Agriculture', 'Social Welfare'];

  // Major Government Policies
  const policies = [
    {
      name: 'Digital India',
      category: 'Infrastructure',
      launched: '2015',
      status: 'Active',
      completion: 75,
      budget: '₹1,13,000 Cr',
      beneficiaries: '130 Cr',
      objectives: ['Digital Infrastructure', 'Digital Literacy', 'Digital Services'],
    },
    {
      name: 'Make in India',
      category: 'Employment',
      launched: '2014',
      status: 'Active',
      completion: 68,
      budget: '₹6,000 Cr',
      beneficiaries: '5 Cr Jobs',
      objectives: ['Manufacturing Growth', 'Job Creation', 'FDI Attraction'],
    },
    {
      name: 'Swachh Bharat Mission',
      category: 'Social Welfare',
      launched: '2014',
      status: 'Active',
      completion: 100,
      budget: '₹62,009 Cr',
      beneficiaries: '60 Cr',
      objectives: ['Clean India', 'Sanitation', 'Waste Management'],
    },
    {
      name: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      launched: '2019',
      status: 'Active',
      completion: 100,
      budget: '₹60,000 Cr/year',
      beneficiaries: '11 Cr Farmers',
      objectives: ['Farmer Income Support', 'Agricultural Growth'],
    },
  ];

  // Government Promises Tracking
  const promises = [
    {
      promise: '10 Crore Jobs by 2025',
      category: 'Employment',
      status: 'In Progress',
      completion: 42,
      achieved: '4.2 Crore',
      target: '10 Crore',
      deadline: '2025',
    },
    {
      promise: 'Housing for All by 2024',
      category: 'Infrastructure',
      status: 'In Progress',
      completion: 85,
      achieved: '2.55 Crore',
      target: '3 Crore',
      deadline: '2024',
    },
    {
      promise: 'Double Farmers Income by 2024',
      category: 'Agriculture',
      status: 'In Progress',
      completion: 78,
      achieved: '78%',
      target: '100%',
      deadline: '2024',
    },
    {
      promise: '100% Electrification',
      category: 'Infrastructure',
      status: 'Completed',
      completion: 100,
      achieved: '100%',
      target: '100%',
      deadline: '2019',
    },
    {
      promise: 'Toilet for Every Household',
      category: 'Social Welfare',
      status: 'Completed',
      completion: 100,
      achieved: '11 Crore',
      target: '11 Crore',
      deadline: '2019',
    },
  ];

  // Future Plans
  const futurePlans = [
    {
      plan: 'Green Energy Mission',
      timeline: '2024-2030',
      budget: '₹35,000 Cr',
      objectives: ['500 GW Renewable Energy', 'Net Zero by 2070'],
    },
    {
      plan: 'National Education Policy Implementation',
      timeline: '2024-2030',
      budget: '₹1,04,278 Cr',
      objectives: ['Universal Education', 'Skill Development', 'Research Excellence'],
    },
    {
      plan: 'Smart Cities Mission Phase 2',
      timeline: '2024-2028',
      budget: '₹48,000 Cr',
      objectives: ['100 Smart Cities', 'Urban Infrastructure', 'Digital Governance'],
    },
    {
      plan: 'National Health Stack',
      timeline: '2024-2027',
      budget: '₹25,000 Cr',
      objectives: ['Digital Health Records', 'Telemedicine', 'AI in Healthcare'],
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Government Policies & Promises Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track government policies, promises, and future plans
            </Typography>
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Active Policies
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#16A34A">
                156
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Promises Completed
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#2563EB">
                89
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                In Progress
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#D97706">
                67
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#FCE7F3', border: '1px solid #FBCFE8', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Future Plans
              </Typography>
              <Typography variant="h4" fontWeight={700} color="#DB2777">
                45
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="Active Policies" />
            <Tab label="Promises Tracker" />
            <Tab label="Future Plans" />
          </Tabs>

          {/* Tab 1: Active Policies */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    placeholder="Search policies..."
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
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FilterList />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                {policies.map((policy, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1, height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" fontWeight={600}>
                            {policy.name}
                          </Typography>
                          <Chip label={policy.status} size="small" color="success" />
                        </Box>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Category
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {policy.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Launched
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {policy.launched}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Budget
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {policy.budget}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Beneficiaries
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {policy.beneficiaries}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Completion: {policy.completion}%
                          </Typography>
                          <LinearProgress variant="determinate" value={policy.completion} sx={{ height: 6, borderRadius: 1, mt: 0.5 }} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {policy.objectives.map((obj, idx) => (
                            <Chip key={idx} label={obj} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 2: Promises Tracker */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Government Promises Status
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {promises.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" fontWeight={600}>
                              {item.promise}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
                              <Chip
                                label={item.status}
                                size="small"
                                color={item.status === 'Completed' ? 'success' : 'warning'}
                                icon={item.status === 'Completed' ? <CheckCircle /> : <Pending />}
                              />
                              <Chip label={item.category} size="small" variant="outlined" />
                              <Typography variant="body2" color="text.secondary">
                                Deadline: {item.deadline}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={600}>
                              Progress: {item.completion}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.achieved} / {item.target}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={item.completion}
                            sx={{ height: 8, borderRadius: 1 }}
                            color={item.status === 'Completed' ? 'success' : 'warning'}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          {/* Tab 3: Future Plans */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Upcoming Government Plans
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {futurePlans.map((plan, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {plan.plan}
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Timeline
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {plan.timeline}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">
                              Budget
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {plan.budget}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography variant="caption" color="text.secondary">
                          Key Objectives
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {plan.objectives.map((obj, idx) => (
                            <Chip key={idx} label={obj} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
