import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Report,
  AddCircle,
  FilterList,
  Security,
  LocationOn,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

export default function FIRsListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [firs, setFirs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchFIRs();
  }, [filter]);

  const fetchFIRs = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:4000/api/crime/firs', {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filter !== 'ALL' ? filter : undefined },
      });
      setFirs(response.data.data.firs || []);
    } catch (error) {
      console.error('Failed to fetch FIRs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      REGISTERED: '#2196f3',
      UNDER_INVESTIGATION: '#ff9800',
      CHARGE_SHEET_FILED: '#9c27b0',
      TRIAL: '#f57c00',
      CLOSED: '#4caf50',
      CANCELLED: '#f44336',
    };
    return colors[status] || '#757575';
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                {t('fir.myFIRs')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage all your filed FIRs (First Information Reports)
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              color="error"
              startIcon={<AddCircle />}
              onClick={() => navigate('/file-fir')}
              sx={{ borderRadius: 1 }}
            >
              {t('fir.fileFIR')}
            </Button>
          </Box>
        </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {firs.length}
            </Typography>
            <Typography variant="caption">Total FIRs</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {firs.filter((f) => f.status === 'REGISTERED').length}
            </Typography>
            <Typography variant="caption">Registered</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {firs.filter((f) => f.status === 'UNDER_INVESTIGATION').length}
            </Typography>
            <Typography variant="caption">Under Investigation</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {firs.filter((f) => f.status === 'CLOSED').length}
            </Typography>
            <Typography variant="caption">Closed</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            Filter FIRs
          </Typography>
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filter}
              label="Status Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="ALL">All FIRs</MenuItem>
              <MenuItem value="REGISTERED">Registered</MenuItem>
              <MenuItem value="UNDER_INVESTIGATION">Under Investigation</MenuItem>
              <MenuItem value="CHARGE_SHEET_FILED">Charge Sheet Filed</MenuItem>
              <MenuItem value="TRIAL">Trial</MenuItem>
              <MenuItem value="CLOSED">Closed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* FIRs List */}
      {isLoading ? (
        <Box>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography textAlign="center" color="text.secondary">
            Loading FIRs...
          </Typography>
        </Box>
      ) : firs.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: 'background.default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 3,
            }}
          >
            <Security sx={{ fontSize: 60, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No FIRs Filed Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            File your first FIR to report a crime incident to the police
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="error"
            startIcon={<AddCircle />}
            onClick={() => navigate('/file-fir')}
          >
            File FIR
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {firs.map((fir) => (
            <Grid item xs={12} key={fir.id}>
              <Card
                elevation={0}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'error.main',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={() => navigate(`/firs/${fir.id}`)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                      <Box display="flex" gap={2} mb={2}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: getStatusColor(fir.status),
                          }}
                        >
                          <Security />
                        </Avatar>
                        <Box flexGrow={1}>
                          <Typography variant="h6" fontWeight={600} gutterBottom>
                            {fir.crimeType.replace('_', ' ')}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                            <Chip
                              label={`FIR: ${fir.firNumber}`}
                              size="small"
                              variant="outlined"
                              color="error"
                            />
                            <Chip
                              label={fir.priority}
                              size="small"
                              color={
                                fir.priority === 'CRITICAL'
                                  ? 'error'
                                  : fir.priority === 'HIGH'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                            {fir.policeStation && (
                              <Chip
                                label={fir.policeStation}
                                size="small"
                                icon={<Security fontSize="small" />}
                              />
                            )}
                          </Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {fir.description}
                          </Typography>
                        </Box>
                      </Box>

                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocationOn fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {fir.district}, {fir.state}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Incident: {format(new Date(fir.incidentDate), 'MMM dd, yyyy')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Chip
                          label={fir.status.replace('_', ' ')}
                          sx={{
                            bgcolor: getStatusColor(fir.status),
                            color: 'white',
                            fontWeight: 600,
                            px: 2,
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          endIcon={<TrendingUp />}
                          sx={{ mt: 2 }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      </Container>
    </Box>
  );
}
