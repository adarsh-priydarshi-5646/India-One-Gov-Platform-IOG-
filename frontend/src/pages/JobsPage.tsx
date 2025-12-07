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
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Business,
  AttachMoney,
  AccessTime,
} from '@mui/icons-material';

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Corp India',
      location: 'Mumbai, Maharashtra',
      salary: '₹8-12 LPA',
      type: 'Full Time',
      experience: '2-5 years',
      skills: ['JavaScript', 'React', 'Node.js'],
      posted: '2 days ago',
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'Analytics Inc',
      location: 'Bangalore, Karnataka',
      salary: '₹6-10 LPA',
      type: 'Full Time',
      experience: '1-3 years',
      skills: ['Python', 'SQL', 'Excel'],
      posted: '5 days ago',
    },
    {
      id: 3,
      title: 'Civil Engineer',
      company: 'Build Solutions',
      location: 'Delhi',
      salary: '₹5-8 LPA',
      type: 'Full Time',
      experience: '3-7 years',
      skills: ['AutoCAD', 'Project Management'],
      posted: '1 week ago',
    },
    {
      id: 4,
      title: 'Teacher',
      company: 'EduTech School',
      location: 'Pune, Maharashtra',
      salary: '₹4-6 LPA',
      type: 'Full Time',
      experience: '2-4 years',
      skills: ['Teaching', 'Communication'],
      posted: '3 days ago',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Job Portal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find government and private sector jobs across India
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search jobs by title, company, or skills..."
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
            <Button variant="contained" fullWidth size="large">
              Search Jobs
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              {jobs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Jobs
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="secondary">
              50+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Companies
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="info.main">
              15+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cities
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="success.main">
              1000+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Applications
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Job Listings */}
      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box display="flex" gap={2}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                      }}
                    >
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label={job.type} color="primary" />
                </Box>

                <Stack direction="row" spacing={3} mb={2} flexWrap="wrap">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{job.location}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AttachMoney fontSize="small" color="action" />
                    <Typography variant="body2">{job.salary}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Work fontSize="small" color="action" />
                    <Typography variant="body2">{job.experience}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2">{job.posted}</Typography>
                  </Box>
                </Stack>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {job.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>

                <Box display="flex" gap={2}>
                  <Button variant="contained">Apply Now</Button>
                  <Button variant="outlined">View Details</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
