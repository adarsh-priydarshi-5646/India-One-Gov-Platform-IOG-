import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createComplaint } from '@/store/complaintSlice';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { CloudUpload, Delete, ArrowBack, AddCircle, AttachFile } from '@mui/icons-material';
import { COMPLAINT_CATEGORIES, COMPLAINT_SUB_CATEGORIES, MAX_FILE_SIZE } from '@/config/constants';
import { INDIAN_STATES, getDistrictsByState } from '@/data/indiaLocations';
import { toast } from 'react-toastify';

export default function FileComplaintPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { isLoading, error } = useAppSelector((state) => state.complaints);

  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    title: '',
    description: '',
    address: '',
    state: '',
    district: '',
    pincode: '',
    locationLat: 0,
    locationLng: 0,
    // Additional fields for specific complaint types
    officerName: '',
    officerDesignation: '',
    officerDepartment: '',
    officerBadgeNumber: '',
    politicianName: '',
    politicianPosition: '',
    politicianConstituency: '',
    incidentDate: '',
    incidentTime: '',
    witnessName: '',
    witnessContact: '',
    estimatedLoss: '',
    urgencyLevel: 'MEDIUM',
  });

  const [files, setFiles] = useState<File[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);

  React.useEffect(() => {
    if (formData.state) {
      const stateDistricts = getDistrictsByState(formData.state);
      setDistricts(stateDistricts);
      setFormData((prev) => ({ ...prev, district: '' }));
    }
  }, [formData.state]);

  React.useEffect(() => {
    if (formData.category && COMPLAINT_SUB_CATEGORIES[formData.category]) {
      setSubCategories(COMPLAINT_SUB_CATEGORIES[formData.category]);
    } else {
      setSubCategories([]);
    }
    setFormData((prev) => ({ ...prev, subCategory: '' }));
  }, [formData.category]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
      'video/mp4': ['.mp4'],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 5));
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          if (error.code === 'file-too-large') {
            toast.error('File size exceeds 10MB limit');
          } else if (error.code === 'too-many-files') {
            toast.error('Maximum 5 files allowed');
          } else {
            toast.error(error.message);
          }
        });
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const complaintData = {
            ...formData,
            locationLat: position.coords.latitude,
            locationLng: position.coords.longitude,
          };

          const result = await dispatch(createComplaint({ data: complaintData, files }));

          if (createComplaint.fulfilled.match(result)) {
            toast.success('Complaint filed successfully!');
            navigate('/dashboard');
          }
        },
        (error) => {
          // If location denied, use default coordinates
          console.error('Location error:', error);
          submitWithoutLocation();
        }
      );
    } else {
      submitWithoutLocation();
    }
  };

  const submitWithoutLocation = async () => {
    const result = await dispatch(createComplaint({ data: formData, files }));

    if (createComplaint.fulfilled.match(result)) {
      toast.success('Complaint filed successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <Box sx={{ bgcolor: '#FFFFFF', minHeight: '100vh', m: 0, p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mb: 2, borderRadius: 1 }}>
          Back to Dashboard
        </Button>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 1, border: '1px solid #DDDDDD' }}>
          <Box sx={{ borderLeft: '4px solid', borderColor: 'primary.main', pl: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              File New Complaint
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit your complaint with detailed information
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 1,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <AddCircle sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              File a Complaint
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Report infrastructure or service issues to the government
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleChange}>
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              {subCategories.length > 0 ? (
                <FormControl fullWidth required>
                  <InputLabel>Sub-Category</InputLabel>
                  <Select name="subCategory" value={formData.subCategory} onChange={handleChange}>
                    {subCategories.map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="Sub-Category (Optional)"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Complaint Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                helperText="Min 10 characters"
                inputProps={{ minLength: 10 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Detailed Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                helperText="Min 50 characters. Please provide as much detail as possible including what happened, when, and who was involved"
                inputProps={{ minLength: 50 }}
              />
            </Grid>

            {/* Conditional Fields Based on Category */}
            {(formData.category === 'Government Employee Misconduct' || 
              formData.category === 'Police Misconduct' || 
              formData.category === 'Bribery/Corruption') && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Officer/Employee Details" />
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Officer/Employee Name"
                    name="officerName"
                    value={formData.officerName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Designation/Rank"
                    name="officerDesignation"
                    value={formData.officerDesignation}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Department/Office"
                    name="officerDepartment"
                    value={formData.officerDepartment}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Badge/ID Number (if known)"
                    name="officerBadgeNumber"
                    value={formData.officerBadgeNumber}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {(formData.category === 'Politician Misconduct' || 
              formData.category === 'Misuse of Funds' || 
              formData.category === 'Unfulfilled Promises') && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Politician Details" />
                  </Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Politician Name"
                    name="politicianName"
                    value={formData.politicianName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Position (MLA/MP/Minister)"
                    name="politicianPosition"
                    value={formData.politicianPosition}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Constituency/Area"
                    name="politicianConstituency"
                    value={formData.politicianConstituency}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Incident Date and Time */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Incident Details" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Incident Date"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Incident Time (if known)"
                name="incidentTime"
                value={formData.incidentTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Urgency Level */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Urgency Level</InputLabel>
                <Select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange}>
                  <MenuItem value="LOW">Low - Can wait</MenuItem>
                  <MenuItem value="MEDIUM">Medium - Normal priority</MenuItem>
                  <MenuItem value="HIGH">High - Needs attention soon</MenuItem>
                  <MenuItem value="URGENT">Urgent - Immediate action required</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Financial Loss (if applicable) */}
            {(formData.category === 'Bribery/Corruption' || 
              formData.category === 'Misuse of Funds') && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Estimated Financial Loss (₹)"
                  name="estimatedLoss"
                  type="number"
                  value={formData.estimatedLoss}
                  onChange={handleChange}
                  InputProps={{ startAdornment: '₹' }}
                />
              </Grid>
            )}

            {/* Witness Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }}>
                <Chip label="Witness Information (Optional)" />
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Witness Name"
                name="witnessName"
                value={formData.witnessName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Witness Contact"
                name="witnessContact"
                value={formData.witnessContact}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Address/Location"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select name="state" value={formData.state} onChange={handleChange}>
                  {INDIAN_STATES.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required disabled={!formData.state}>
                <InputLabel>District</InputLabel>
                <Select name="district" value={formData.district} onChange={handleChange}>
                  {districts.map((district) => (
                    <MenuItem key={district.code} value={district.code}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField label="PIN Code" name="pincode" value={formData.pincode} onChange={handleChange} fullWidth />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Upload Evidence (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Upload photos, videos, or documents to support your complaint
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  bgcolor: 'background.default',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <CloudUpload sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & drop files here
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  or click to browse from your device
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip label="Images" size="small" sx={{ m: 0.5 }} />
                  <Chip label="PDFs" size="small" sx={{ m: 0.5 }} />
                  <Chip label="Videos" size="small" sx={{ m: 0.5 }} />
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  Max 10MB per file • Up to 5 files
                </Typography>
              </Box>

              {files.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Files ({files.length}/5)
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {files.map((file, index) => (
                      <Chip
                        key={index}
                        icon={<AttachFile />}
                        label={`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
                        onDelete={() => removeFile(index)}
                        deleteIcon={<Delete />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AddCircle />}
              >
                {isLoading ? 'Submitting Complaint...' : 'Submit Complaint'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      </Container>
    </Box>
  );
}
