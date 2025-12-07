import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchComplaintById } from '@/store/complaintSlice';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { ArrowBack, LocationOn, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import { STATUS_COLORS } from '@/config/constants';

export default function ComplaintDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentComplaint, isLoading } = useAppSelector((state) => state.complaints);

  useEffect(() => {
    if (id) {
      dispatch(fetchComplaintById(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentComplaint) {
    return (
      <Container>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Complaint not found
        </Typography>
      </Container>
    );
  }

  const getStatusColor = (status: string) => STATUS_COLORS[status] || '#000';

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <IconButton onClick={() => navigate('/complaints')} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              Complaint Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and track your complaint status
            </Typography>
          </Box>
        </Box>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <div>
              <Typography variant="h5" gutterBottom>
                {currentComplaint.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Complaint #{currentComplaint.complaintNumber}
              </Typography>
            </div>
            <Chip
              label={currentComplaint.status.replace('_', ' ')}
              sx={{
                bgcolor: getStatusColor(currentComplaint.status),
                color: 'white',
                fontSize: '1rem',
                px: 2,
                py: 1,
              }}
            />
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
            <Chip label={currentComplaint.category} color="primary" />
            <Chip
              label={currentComplaint.priority}
              color={
                currentComplaint.priority === 'URGENT'
                  ? 'error'
                  : currentComplaint.priority === 'HIGH'
                  ? 'warning'
                  : 'default'
              }
            />
            {currentComplaint.department && <Chip label={currentComplaint.department} variant="outlined" />}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Description */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {currentComplaint.description}
              </Typography>
            </Paper>

            {/* Timeline */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Status Timeline
              </Typography>
              <Timeline position="right">
                <TimelineItem>
                  <TimelineOppositeContent sx={{ color: 'text.secondary' }}>
                    {format(new Date(currentComplaint.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="h6">Submitted</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Complaint filed
                    </Typography>
                  </TimelineContent>
                </TimelineItem>

                {currentComplaint.assignedAt && (
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ color: 'text.secondary' }}>
                      {format(new Date(currentComplaint.assignedAt), 'MMM dd, yyyy HH:mm')}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6">Assigned</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Assigned to officer
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                )}

                {currentComplaint.resolvedAt && (
                  <TimelineItem>
                    <TimelineOppositeContent sx={{ color: 'text.secondary' }}>
                      {format(new Date(currentComplaint.resolvedAt), 'MMM dd, yyyy HH:mm')}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="success" />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="h6">Resolved</Typography>
                      {currentComplaint.resolutionNotes && (
                        <Typography variant="body2">{currentComplaint.resolutionNotes}</Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                )}
              </Timeline>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Location */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <LocationOn color="action" />
                  <Typography variant="h6">Location</Typography>
                </Box>
                <Typography variant="body2" gutterBottom>
                  {currentComplaint.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentComplaint.district}, {currentComplaint.state}
                </Typography>
                {currentComplaint.pincode && (
                  <Typography variant="body2" color="textSecondary">
                    PIN: {currentComplaint.pincode}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Dates */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <CalendarToday color="action" />
                  <Typography variant="h6">Timeline</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Filed on
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(currentComplaint.createdAt), 'MMMM dd, yyyy')}
                  </Typography>
                </Box>
                {currentComplaint.estimatedResolutionDays && (
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Expected resolution
                    </Typography>
                    <Typography variant="body2">
                      {currentComplaint.estimatedResolutionDays} days
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Rating */}
            {currentComplaint.citizenRating && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Rating
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {currentComplaint.citizenRating}/5 ⭐
                  </Typography>
                  {currentComplaint.citizenFeedback && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {currentComplaint.citizenFeedback}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
