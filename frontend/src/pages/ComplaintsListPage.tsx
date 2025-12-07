import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchComplaints } from '@/store/complaintSlice';
import { useTranslation } from 'react-i18next';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  InputAdornment,
  LinearProgress,
  Avatar,
  Stack,
} from '@mui/material';
import {
  FilterList,
  Search,
  AddCircle,
  List as ListIcon,
  LocationOn,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';
import { COMPLAINT_CATEGORIES, STATUS_COLORS } from '@/config/constants';
import { format } from 'date-fns';

export default function ComplaintsListPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { complaints, total, page, pages, isLoading } = useAppSelector((state) => state.complaints);

  const [filters, setFilters] = useState<{
    status: string[];
    category: string[];
    searchQuery: string;
    page: number;
  }>({
    status: [],
    category: [],
    searchQuery: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchComplaints(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (field: string, value: any) => {
    setFilters({
      ...filters,
      [field]: field === 'status' || field === 'category' ? (value ? [value] : []) : value,
      page: 1,
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters({ ...filters, page: value });
  };

  const getStatusColor = (status: string) => STATUS_COLORS[status] || '#000';

  const hasActiveFilters = filters.status.length > 0 || filters.category.length > 0 || filters.searchQuery;

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
              <Typography variant="h5" fontWeight={600}>
                {t('complaints.myComplaints')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track and manage all your filed complaints
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddCircle />}
              onClick={() => navigate('/file-complaint')}
              sx={{ borderRadius: 1 }}
            >
              {t('complaints.fileComplaint')}
            </Button>
          </Box>
        </Box>

      {/* Stats Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {total}
            </Typography>
            <Typography variant="caption">Total Complaints</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {complaints.filter((c) => ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length}
            </Typography>
            <Typography variant="caption">Pending</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {complaints.filter((c) => c.status === 'RESOLVED').length}
            </Typography>
            <Typography variant="caption">Resolved</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
            <Typography variant="h4" fontWeight={700}>
              {complaints.filter((c) => c.status === 'REJECTED').length}
            </Typography>
            <Typography variant="caption">Rejected</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Filter Complaints
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by title or complaint number..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status[0] || ''}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="RESOLVED">Resolved</MenuItem>
                <MenuItem value="CLOSED">Closed</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category[0] || ''}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {hasActiveFilters && (
          <Box mt={2}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setFilters({ status: [], category: [], searchQuery: '', page: 1 })}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Paper>

      {/* Results Summary */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {complaints.length} of {total} complaints
        </Typography>
        {hasActiveFilters && (
          <Chip label="Filters Active" color="primary" size="small" />
        )}
      </Box>

      {/* Complaints List */}
      {isLoading ? (
        <Box>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography textAlign="center" color="text.secondary">
            Loading complaints...
          </Typography>
        </Box>
      ) : complaints.length === 0 ? (
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
            <ListIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {hasActiveFilters ? 'No Complaints Found' : 'No Complaints Yet'}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {hasActiveFilters
              ? 'Try adjusting your filters to see more results'
              : "You haven't filed any complaints yet. Start by filing your first complaint."}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddCircle />}
            onClick={() => navigate('/file-complaint')}
          >
            File New Complaint
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {complaints.map((complaint) => (
              <Grid item xs={12} key={complaint.id}>
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
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/complaints/${complaint.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={9}>
                        <Box display="flex" gap={2} mb={2}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: getStatusColor(complaint.status),
                            }}
                          >
                            <ListIcon />
                          </Avatar>
                          <Box flexGrow={1}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {complaint.title}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" mb={1}>
                              <Chip
                                label={complaint.complaintNumber}
                                size="small"
                                variant="outlined"
                              />
                              <Chip label={complaint.category} size="small" color="primary" />
                              <Chip
                                label={complaint.priority}
                                size="small"
                                color={
                                  complaint.priority === 'URGENT'
                                    ? 'error'
                                    : complaint.priority === 'HIGH'
                                    ? 'warning'
                                    : 'default'
                                }
                              />
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
                              {complaint.description}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {complaint.district}, {complaint.state}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              Filed on {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
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
                            label={complaint.status.replace('_', ' ')}
                            sx={{
                              bgcolor: getStatusColor(complaint.status),
                              color: 'white',
                              fontWeight: 600,
                              px: 2,
                            }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
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

          {/* Pagination */}
          {pages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
      </Container>
    </Box>
  );
}
