import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  People,
  Assignment,
  TrendingUp,
  Warning,
  LocationCity,
  Assessment,
} from '@mui/icons-material';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const stats = {
    totalCitizens: 125000,
    totalComplaints: 8450,
    resolvedComplaints: 6320,
    activeOfficers: 450,
    avgResolutionTime: 4.2,
    satisfactionRate: 87,
  };

  const districtPerformance = [
    { district: 'Central Delhi', complaints: 1250, resolved: 980, rate: 78 },
    { district: 'South Delhi', complaints: 1100, resolved: 920, rate: 84 },
    { district: 'North Delhi', complaints: 980, resolved: 750, rate: 77 },
    { district: 'East Delhi', complaints: 890, resolved: 720, rate: 81 },
    { district: 'West Delhi', complaints: 850, resolved: 690, rate: 81 },
  ];

  const statCards = [
    {
      title: 'Total Citizens',
      value: stats.totalCitizens.toLocaleString(),
      icon: <People />,
      color: '#1976d2',
      change: '+2.5%',
    },
    {
      title: 'Total Complaints',
      value: stats.totalComplaints.toLocaleString(),
      icon: <Assignment />,
      color: '#ed6c02',
      change: '+5.2%',
    },
    {
      title: 'Resolution Rate',
      value: `${Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)}%`,
      icon: <TrendingUp />,
      color: '#2e7d32',
      change: '+3.1%',
    },
    {
      title: 'Active Officers',
      value: stats.activeOfficers,
      icon: <People />,
      color: '#9c27b0',
      change: '+12',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Monitor system-wide performance and analytics
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select
                value={selectedState}
                label="State"
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <MenuItem value="ALL">All States</MenuItem>
                <MenuItem value="DELHI">Delhi</MenuItem>
                <MenuItem value="MAHARASHTRA">Maharashtra</MenuItem>
                <MenuItem value="KARNATAKA">Karnataka</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>District</InputLabel>
              <Select
                value={selectedDistrict}
                label="District"
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <MenuItem value="ALL">All Districts</MenuItem>
                <MenuItem value="CENTRAL">Central Delhi</MenuItem>
                <MenuItem value="SOUTH">South Delhi</MenuItem>
                <MenuItem value="NORTH">North Delhi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: stat.color,
                      color: 'white',
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* District Performance */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              District Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>District</TableCell>
                    <TableCell align="right">Total Complaints</TableCell>
                    <TableCell align="right">Resolved</TableCell>
                    <TableCell align="right">Resolution Rate</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {districtPerformance.map((row) => (
                    <TableRow key={row.district}>
                      <TableCell>{row.district}</TableCell>
                      <TableCell align="right">{row.complaints}</TableCell>
                      <TableCell align="right">{row.resolved}</TableCell>
                      <TableCell align="right">{row.rate}%</TableCell>
                      <TableCell>
                        <Chip
                          label={row.rate >= 80 ? 'Good' : 'Needs Improvement'}
                          size="small"
                          color={row.rate >= 80 ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* System Health */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Health
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Auth Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Complaint Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Crime Service</Typography>
                <Chip label="Online" size="small" color="success" />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2">Database</Typography>
                <Chip label="Healthy" size="small" color="success" />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Key Metrics
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Avg Resolution Time
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.avgResolutionTime} days
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Citizen Satisfaction
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {stats.satisfactionRate}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}
