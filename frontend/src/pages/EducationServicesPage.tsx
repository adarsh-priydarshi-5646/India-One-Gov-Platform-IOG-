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
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  School,
  MenuBook,
  CardMembership,
  Assessment,
  Search,
  ArrowForward,
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

export default function EducationServicesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { title: 'Scholarships', icon: <CardMembership />, color: '#2563EB', count: 45 },
    { title: 'School Admissions', icon: <School />, color: '#7C3AED', count: 120 },
    { title: 'Exam Results', icon: <Assessment />, color: '#DC2626', count: 28 },
    { title: 'Online Courses', icon: <MenuBook />, color: '#059669', count: 89 },
  ];

  const scholarships = [
    { name: 'National Merit Scholarship', amount: '₹50,000', eligibility: 'Class 10-12', deadline: '2024-03-31' },
    { name: 'SC/ST Scholarship', amount: '₹30,000', eligibility: 'All Classes', deadline: '2024-04-15' },
    { name: 'Minority Scholarship', amount: '₹25,000', eligibility: 'Class 8-12', deadline: '2024-04-30' },
    { name: 'Girl Child Education', amount: '₹40,000', eligibility: 'Girls Only', deadline: '2024-05-15' },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Education Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access scholarships, admissions, and educational resources
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
                  p: 2,
                  border: '1px solid #DDDDDD',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    bgcolor: `${service.color}15`,
                    color: service.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.count} Available
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }}>
            <Tab label="Scholarships" />
            <Tab label="Admissions" />
            <Tab label="Certificates" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2}>
                {scholarships.map((scholarship, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {scholarship.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Amount
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scholarship.amount}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Eligibility
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scholarship.eligibility}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Deadline
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {scholarship.deadline}
                            </Typography>
                          </Box>
                        </Box>
                        <Button variant="contained" size="small" endIcon={<ArrowForward />} sx={{ borderRadius: 1 }}>
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                School admission portal coming soon
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Certificate verification portal coming soon
              </Typography>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
