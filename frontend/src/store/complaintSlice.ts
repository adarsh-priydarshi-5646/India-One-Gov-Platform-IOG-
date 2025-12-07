import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getErrorMessage } from '@/services/api';
import { Complaint, CreateComplaintRequest, ComplaintFilters, DashboardStats } from '@/types';
import { COMPLAINT_SERVICE_URL } from '@/config/constants';

interface ComplaintState {
  complaints: Complaint[];
  currentComplaint: Complaint | null;
  stats: DashboardStats | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ComplaintState = {
  complaints: [],
  currentComplaint: null,
  stats: null,
  total: 0,
  page: 1,
  limit: 20,
  pages: 0,
  isLoading: false,
  error: null,
};

// Create axios instance for complaint service via API Gateway
const API_GATEWAY_URL = 'http://localhost:4000';

const complaintAPI = axios.create({
  baseURL: `${API_GATEWAY_URL}/api/complaints`,
});

// Add auth token to requests
complaintAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Async thunks
export const createComplaint = createAsyncThunk(
  'complaints/create',
  async ({ data, files }: { data: CreateComplaintRequest; files: File[] }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append complaint data
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append files
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await complaintAPI.post('/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchComplaints = createAsyncThunk(
  'complaints/fetchAll',
  async (filters: ComplaintFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status.join(','));
      if (filters.category) params.append('category', filters.category.join(','));
      if (filters.priority) params.append('priority', filters.priority.join(','));
      if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await complaintAPI.get(`?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  'complaints/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await complaintAPI.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStats = createAsyncThunk(
  'complaints/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await complaintAPI.get('/stats');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const submitFeedback = createAsyncThunk(
  'complaints/submitFeedback',
  async ({ id, rating, feedback }: { id: string; rating: number; feedback?: string }, { rejectWithValue }) => {
    try {
      const response = await complaintAPI.post(`/api/complaints/${id}/feedback`, { rating, feedback });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const complaintSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Complaint
    builder.addCase(createComplaint.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createComplaint.fulfilled, (state, action) => {
      state.isLoading = false;
      state.complaints.unshift(action.payload);
    });
    builder.addCase(createComplaint.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Complaints
    builder.addCase(fetchComplaints.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchComplaints.fulfilled, (state, action) => {
      state.isLoading = false;
      state.complaints = action.payload.data;
      state.total = action.payload.pagination.total;
      state.page = action.payload.pagination.page;
      state.limit = action.payload.pagination.limit;
      state.pages = action.payload.pagination.pages;
    });
    builder.addCase(fetchComplaints.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Complaint By ID
    builder.addCase(fetchComplaintById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchComplaintById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentComplaint = action.payload;
    });
    builder.addCase(fetchComplaintById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Stats
    builder.addCase(fetchStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });

    // Submit Feedback
    builder.addCase(submitFeedback.fulfilled, (state, action) => {
      state.currentComplaint = action.payload;
      const index = state.complaints.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.complaints[index] = action.payload;
      }
    });
  },
});

export const { clearError } = complaintSlice.actions;
export default complaintSlice.reducer;
