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
  Chip,
  Select,
  FormControl,
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
  Language,
} from '@mui/icons-material';
import Footer from './Footer';

const DRAWER_WIDTH = 260;

interface NavItem {
  titleKey: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { titleKey: 'navigation.dashboard', path: '/dashboard', icon: <Dashboard /> },
  { titleKey: 'complaints.fileComplaint', path: '/file-complaint', icon: <AddCircle /> },
  { titleKey: 'complaints.myComplaints', path: '/complaints', icon: <ListIcon /> },
  { titleKey: 'fir.fileFIR', path: '/file-fir', icon: <Report /> },
  { titleKey: 'fir.myFIRs', path: '/firs', icon: <Security /> },
  { titleKey: 'navigation.jobs', path: '/jobs', icon: <Work />, roles: ['CITIZEN'] },
  { titleKey: 'navigation.analytics', path: '/analytics', icon: <Assessment />, roles: ['OFFICER', 'ADMIN'] },
  { titleKey: 'navigation.admin', path: '/admin', icon: <AdminPanelSettings />, roles: ['ADMIN', 'SUPER_ADMIN'] },
];

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLanguageChange = (event: any) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role || '')
  );

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap component="div">
          🇮🇳 {t('common.appName')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredNavItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.titleKey)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t(navItems.find((item) => item.path === location.pathname)?.titleKey || 'navigation.dashboard')}
          </Typography>

          <FormControl size="small" sx={{ mr: 2, minWidth: 120 }}>
            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '.MuiSvgIcon-root': { color: 'white' },
              }}
              startAdornment={<Language sx={{ mr: 1, color: 'white' }} />}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.nativeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1">{user?.fullName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email || user?.phoneNumber}
              </Typography>
              <Chip
                label={user?.role}
                size="small"
                color="primary"
                sx={{ mt: 1 }}
              />
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

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
        }}
      >
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
