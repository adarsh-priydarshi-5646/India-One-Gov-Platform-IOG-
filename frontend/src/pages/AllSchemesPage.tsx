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
  TextField,
  InputAdornment,
  Chip,
  Button,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocalHospital,
  School,
  Work,
  Agriculture,
  Home,
  AccountBalance,
} from '@mui/icons-material';
import { GOVERNMENT_SCHEMES } from '@/data/governmentSchemes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div hidden={value !== index}>{value === index && <Box sx={{ py: 3 }}>{children}</Box>}</div>;
}

export default function AllSchemesPage() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const categories = [
    { name: 'Healthcare', icon: <LocalHospital />, color: '#7C3AED', count: GOVERNMENT_SCHEMES.healthcare.length },
    { name: 'Education', icon: <School />, color: '#2563EB', count: GOVERNMENT_SCHEMES.education.length },
    { name: 'Employment', icon: <Work />, color: '#059669', count: GOVERNMENT_SCHEMES.employment.length },
    { name: 'Agriculture', icon: <Agriculture />, color: '#D97706', count: GOVERNMENT_SCHEMES.agriculture.length },
    { name: 'Housing', icon: <Home />, color: '#DC2626', count: GOVERNMENT_SCHEMES.housing.length },
    { name: 'Social Welfare', icon: <AccountBalance />, color: '#DB2777', count: GOVERNMENT_SCHEMES.socialWelfare.length },
  ];

  const renderSchemeCard = (scheme: any, index: number) => (
    <Grid item xs={12} md={6} key={index}>
      <Card elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1, height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {scheme.name}
            </Typography>
            <Chip label={scheme.status} size="small" color="success" />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {scheme.description}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Ministry
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>
                {scheme.ministry}
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
          </Grid>

          {scheme.eligibility && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Eligibility
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {scheme.eligibility}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" fullWidth sx={{ borderRadius: 1 }}>
              Apply Now
            </Button>
            {scheme.website && (
              <Button
                variant="outlined"
                size="small"
                fullWidth
                sx={{ borderRadius: 1 }}
                onClick={() => window.open(scheme.website, '_blank')}
              >
                Visit Website
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              All Government Schemes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete list of central government schemes and services
            </Typography>
          </Box>
        </Box>

        {/* Statistics */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #DDDDDD',
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => setTabValue(index)}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: `${category.color}15`,
                    color: category.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  {category.icon}
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {category.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {category.count} Schemes
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Search and Filter */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Search schemes..."
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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterList />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Paper elevation={0} sx={{ border: '1px solid #DDDDDD', borderRadius: 1 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: '1px solid #DDDDDD' }} variant="scrollable">
            <Tab label="Healthcare" />
            <Tab label="Education" />
            <Tab label="Employment" />
            <Tab label="Agriculture" />
            <Tab label="Housing" />
            <Tab label="Social Welfare" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Healthcare Schemes ({GOVERNMENT_SCHEMES.healthcare.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.healthcare.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Education Schemes ({GOVERNMENT_SCHEMES.education.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.education.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Employment Schemes ({GOVERNMENT_SCHEMES.employment.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.employment.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Agriculture Schemes ({GOVERNMENT_SCHEMES.agriculture.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.agriculture.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Housing Schemes ({GOVERNMENT_SCHEMES.housing.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.housing.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={5}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Social Welfare Schemes ({GOVERNMENT_SCHEMES.socialWelfare.length})
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {GOVERNMENT_SCHEMES.socialWelfare.map((scheme, index) => renderSchemeCard(scheme, index))}
              </Grid>
            </Box>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}
