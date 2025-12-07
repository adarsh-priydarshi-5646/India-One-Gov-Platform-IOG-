import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#C8102E',
      light: '#E31837',
      dark: '#A00D24',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#003DA5',
      light: '#0052CC',
      dark: '#002B73',
      contrastText: '#FFFFFF',
    },
    error: { main: '#DC2626' },
    warning: { main: '#F59E0B' },
    info: { main: '#0284C7' },
    success: { main: '#16A34A' },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    divider: '#DDDDDD',
  },
  typography: {
    fontFamily: '"Microsoft YaHei", "SimHei", "Noto Sans", "Roboto", "Arial", sans-serif',
    fontSize: 14,
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #DDDDDD',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          border: '1px solid #DDDDDD',
        },
      },
    },
  },
});

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import FileComplaintPage from './pages/FileComplaintPage';
import ComplaintsListPage from './pages/ComplaintsListPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import FileFIRPage from './pages/FileFIRPage';
import FIRsListPage from './pages/FIRsListPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import OfficerDashboard from './pages/dashboards/OfficerDashboard';
import GovernmentJobsPortal from './pages/GovernmentJobsPortal';
import ProfilePage from './pages/ProfilePage';
import ServicesPage from './pages/ServicesPage';
import CorruptionReportPage from './pages/CorruptionReportPage';
import EducationServicesPage from './pages/EducationServicesPage';
import ComprehensiveHealthcarePage from './pages/ComprehensiveHealthcarePage';
import TransportServicesPage from './pages/TransportServicesPage';
import BusinessServicesPage from './pages/BusinessServicesPage';
import HousingServicesPage from './pages/HousingServicesPage';
import GovernmentPoliciesPage from './pages/GovernmentPoliciesPage';
import AllSchemesPage from './pages/AllSchemesPage';
import AgricultureServicesPage from './pages/AgricultureServicesPage';
import SocialWelfareServicesPage from './pages/SocialWelfareServicesPage';
import PensionServicesPage from './pages/PensionServicesPage';
import TaxServicesPage from './pages/TaxServicesPage';
import DonatePage from './pages/DonatePage';
import ChatBot from './components/AIAssistant/ChatBot';
import { Box } from '@mui/material';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ m: 0, p: 0 }}>
        <ChatBot />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/analytics" element={<AdminDashboard />} />
              <Route path="/file-complaint" element={<FileComplaintPage />} />
              <Route path="/complaints" element={<ComplaintsListPage />} />
              <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />
              <Route path="/file-fir" element={<FileFIRPage />} />
              <Route path="/firs" element={<FIRsListPage />} />
              <Route path="/jobs" element={<GovernmentJobsPortal />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/corruption-report" element={<CorruptionReportPage />} />
              <Route path="/education" element={<EducationServicesPage />} />
              <Route path="/health" element={<ComprehensiveHealthcarePage />} />
              <Route path="/transport" element={<TransportServicesPage />} />
              <Route path="/business" element={<BusinessServicesPage />} />
              <Route path="/housing" element={<HousingServicesPage />} />
              <Route path="/policies" element={<GovernmentPoliciesPage />} />
              <Route path="/all-schemes" element={<AllSchemesPage />} />
              <Route path="/agriculture" element={<AgricultureServicesPage />} />
              <Route path="/social-welfare" element={<SocialWelfareServicesPage />} />
              <Route path="/pension" element={<PensionServicesPage />} />
              <Route path="/tax" element={<TaxServicesPage />} />
              <Route path="/donate" element={<DonatePage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
