import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/hooks/redux';

export default function ChineseHeader() {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' },
  ];

  return (
    <Box sx={{ m: 0, p: 0 }}>
      {/* Top Bar - Language Selector */}
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
            <Typography variant="caption" color="text.secondary">
              {user?.fullName && `${t('dashboard.welcomeUser')}: ${user.fullName}`}
            </Typography>
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

      {/* Navigation Bar - Chinese Style */}
      <Box sx={{ bgcolor: '#003DA5', color: 'white', m: 0, p: 0 }}>
        <Container maxWidth="xl" sx={{ m: 0, p: 0 }}>
          <Stack direction="row" spacing={0}>
            {[
              { key: 'nav.home', path: '/dashboard' },
              { key: 'nav.services', path: '/dashboard' },
              { key: 'nav.complaints', path: '/complaints' },
              { key: 'nav.firs', path: '/firs' },
              { key: 'nav.jobs', path: '/jobs' },
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
                  {t(item.key)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
