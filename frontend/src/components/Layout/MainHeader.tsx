import React from 'react';
import { Box, Container, Typography, Stack, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/authSlice';
import { Person, ExitToApp, Dashboard, Settings } from '@mui/icons-material';

export default function MainHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logout());
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleDashboard = () => {
    handleMenuClose();
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
      navigate('/admin');
    } else if (user?.role === 'OFFICER') {
      navigate('/officer');
    } else {
      navigate('/dashboard');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '#DC2626';
      case 'ADMIN': return '#EA580C';
      case 'OFFICER': return '#0284C7';
      case 'POLITICIAN': return '#7C3AED';
      default: return '#16A34A';
    }
  };

  return (
    <Box sx={{ m: 0, p: 0 }}>
      {/* Top Bar - Language Selector & User Menu */}
      <Box sx={{ bgcolor: '#F5F5F5', borderBottom: '1px solid #E0E0E0', m: 0, p: 0 }}>
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.5,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {user?.fullName && `${t('dashboard.welcomeUser')}: ${user.fullName}`}
              </Typography>
              {user?.role && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    bgcolor: getRoleBadgeColor(user.role),
                    color: 'white',
                    borderRadius: 0.5,
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {user.role}
                </Box>
              )}
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} divider={<Box sx={{ width: '1px', bgcolor: '#CCC', height: 12 }} />}>
                {languages.map((lang) => (
                  <Typography
                    key={lang.code}
                    variant="caption"
                    sx={{
                      cursor: 'pointer',
                      color: i18n.language === lang.code ? 'primary.main' : 'text.secondary',
                      fontWeight: i18n.language === lang.code ? 600 : 400,
                      '&:hover': { color: 'primary.main' },
                    }}
                    onClick={() => i18n.changeLanguage(lang.code)}
                  >
                    {lang.name}
                  </Typography>
                ))}
              </Stack>
              <Box sx={{ borderLeft: '1px solid #CCC', pl: 2 }}>
                <Button
                  size="small"
                  onClick={handleMenuOpen}
                  startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>{user?.fullName?.charAt(0)}</Avatar>}
                  sx={{ textTransform: 'none', color: 'text.primary', minWidth: 'auto' }}
                >
                  <Typography variant="caption">{user?.fullName?.split(' ')[0]}</Typography>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: { mt: 1, minWidth: 200 }
                  }}
                >
                  <MenuItem onClick={handleDashboard}>
                    <Dashboard fontSize="small" sx={{ mr: 1 }} />
                    {t('nav.dashboard')}
                  </MenuItem>
                  <MenuItem onClick={handleProfile}>
                    <Person fontSize="small" sx={{ mr: 1 }} />
                    {t('nav.profile')}
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ExitToApp fontSize="small" sx={{ mr: 1 }} />
                    {t('nav.logout')}
                  </MenuItem>
                </Menu>
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Main Red Header - Chinese Government Style */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2.5,
          borderBottom: '3px solid',
          borderColor: 'primary.dark',
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'white',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
              }}
            >
              🇮🇳
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {t('common.appName')}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {t('header.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Bar */}
      <Box sx={{ bgcolor: '#003DA5', color: 'white', m: 0, p: 0 }}>
        <Container maxWidth="xl" sx={{ m: 0, p: 0 }}>
          <Stack direction="row" spacing={0}>
            {[
              { key: 'nav.home', path: '/dashboard' },
              { key: 'nav.services', path: '/services' },
              { key: 'nav.complaints', path: '/complaints' },
              { key: 'nav.firs', path: '/firs' },
              { key: 'nav.jobs', path: '/jobs' },
              { label: 'Schemes', path: '/all-schemes' },
              { label: 'Policies', path: '/policies' },
              { label: '❤️ Donate', path: '/donate' },
            ].map((item, index) => (
              <Box
                key={index}
                component="a"
                href={item.path}
                sx={{
                  px: 3,
                  py: 1.5,
                  cursor: 'pointer',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {item.key ? t(item.key) : item.label}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
