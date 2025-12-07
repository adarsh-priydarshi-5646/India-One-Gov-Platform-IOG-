import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Map,
  Assessment,
} from '@mui/icons-material';

export default function OfficerDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    assignedCases: 24,
    resolvedToday: 8,
    pendingCases: 16,
    avgResolutionTime: 3.2,
  });

  const [recentCases, setRecentCases] = useState([
    { id: 'C001', type: 'Complaint', title: 'Road Repair', priority: 'HIGH', status: 'IN_PROGRESS' },
    { id: 'F002', type: 'FIR', title: 'Theft Report', priority: 'URGENT', status: 'ASSIGNED' },
    { id: 'C003', type: 'Complaint', title: 'Water Supply', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: 'F004', type: 'FIR', title: 'Assault Case', priority: 'URGENT', status: 'ASSIGNED' },
  ]);

  const statCards = [
    {
      title: 'Assigned Cases',
      value: stats.assignedCases,
      icon: <Assignment />,
      color: '#1976d2',
      change: '+3 today',
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedToday,
      icon: <CheckCircle />,
      color: '#2e7d32',
      change: '+2 from yesterday',
    },
    {
      title: 'Pending Cases',
      value: stats.pendingCases,
      icon: <Schedule />,
      color: '#ed6c02',
      change: '-1 from yesterday',
    },
    {
      title: 'Avg Resolution (days)',
      value: stats.avgResolutionTime,
      icon: <TrendingUp />,
      color: '#9c27b0',
      change: '-0.3 days',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Officer Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your assigned cases and track performance
        </Typography>
      </Box>

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
        {/* Recent Cases */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Assigned Cases</Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Case ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentCases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell>{case_.id}</TableCell>
                      <TableCell>{case_.type}</TableCell>
                      <TableCell>{case_.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={case_.priority}
                          size="small"
                          color={case_.priority === 'URGENT' ? 'error' : 'warning'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip label={case_.status} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="contained">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button variant="contained" startIcon={<Map />} fullWidth>
                Crime Heatmap
              </Button>
              <Button variant="contained" startIcon={<Assessment />} fullWidth>
                Generate Report
              </Button>
              <Button variant="outlined" fullWidth>
                Update Case Status
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance This Month
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Cases Resolved</Typography>
                <Typography variant="body2" fontWeight="bold">
                  85%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={85} sx={{ mb: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Response Time</Typography>
                <Typography variant="body2" fontWeight="bold">
                  92%
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={92} color="success" />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Container>
    </Box>
  );
}
