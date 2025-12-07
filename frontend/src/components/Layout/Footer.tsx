import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1F2937',
        color: 'white',
        py: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('common.appName')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
              {t('footer.description')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('footer.quickLinks')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="/dashboard" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('navigation.dashboard')}
              </Link>
              <Link href="/file-complaint" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('complaints.fileComplaint')}
              </Link>
              <Link href="/file-fir" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('fir.fileFIR')}
              </Link>
              <Link href="/jobs" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('navigation.jobs')}
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('footer.support')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('footer.helpCenter')}
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('footer.faqs')}
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('footer.privacy')}
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
                {t('footer.terms')}
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              {t('footer.contact')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
              {t('footer.helpline')}: 1800-XXX-XXXX
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.875rem' }}>
              {t('footer.email')}: support@iog.gov.in
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.8125rem' }}>
            © {currentYear} {t('common.appName')}. {t('footer.rights')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
