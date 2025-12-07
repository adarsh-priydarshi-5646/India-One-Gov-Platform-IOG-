import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import ChineseHeader from './ChineseHeader';
import Footer from './Footer';

export default function ChineseLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FFFFFF', m: 0, p: 0 }}>
      <ChineseHeader />
      <Box sx={{ flexGrow: 1, m: 0, p: 0 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
