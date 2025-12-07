import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/authSlice';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Select,
  FormControl,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  AddCircle,
  List as ListIcon,
  Report,
  Person,
  Notifications,
  Logout as LogoutIcon,
  Security,
  Work,
  Assessment,
  AdminPanelSettings,
  Home,
  Close,
} from '@mui/icons-material';
import Footer from './Footer';

const DRAWER_WIDTH = 280;

interface NavItem {
  titleKey: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: number;
}

const navItems: NavItem[] = [
  { titleKey: 'navigation.dashboard', path: '/dashboard', icon: <Dashboard />, badge: 0 },
  { titleKey: 'complaints.fileComplaint', path: '/file-complaint', icon: <AddCircle /> },
  { titleKey: 'complaints.myComplaints', path: '/complaints', icon: <ListIcon />, badge: 0 },
  { titleKey: 'fir.fileFIR', path: '/file-fir', icon: <Report /> },
  { titleKey: 'fir.myFIRs', path: '/firs', icon: <Security />, badge: 0 },
  { titleKey: 'navigation.jobs', path: '/jobs', icon: <Work />, roles: ['CITIZEN'] },
  { titleKey: 'navigation.analytics', path: '/analytics', icon: <Assessment />, roles: ['OFFICER', 'ADMIN'] },
  { titleKey: 'navigation.admin', path: '/admin', icon: <AdminPanelSettings />, roles: ['ADMIN', 'SUPER_ADMIN'] },
];

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

export default function ImprovedMainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleLanguageChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  );

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}
        >
          🇮🇳
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, fontSize: '1.125rem' }}>
            IOG Platform
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.8125rem' }}>
            India One-Gov
          </Typography>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: isActive ? 'primary.main' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={t(item.titleKey)} 
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: '0.75rem',
                      bgcolor: isActive ? 'white' : 'error.main',
                      color: isActive ? 'primary.main' : 'white',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Info at Bottom */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.default',
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            {user?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {user?.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Home sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              /
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(navItems.find((item) => item.path === location.pathname)?.titleKey || 'navigation.dashboard')}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Language Selector */}
          <FormControl size="small" sx={{ mr: 2, minWidth: 140 }}>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                bgcolor: 'background.default',
                borderRadius: 2,
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Notifications */}
          <IconButton sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { mt: 1, minWidth: 200 },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || user?.phoneNumber}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              {t('profile.myProfile')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {t('common.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              border: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <Close />
            </IconButton>
          </Box>
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              border: 'none',
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
