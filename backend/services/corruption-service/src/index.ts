import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'corruption-service',
    timestamp: new Date().toISOString(),
  });
});

// Corruption reporting endpoints
app.post('/api/corruption/report', (req, res) => {
  res.json({ success: true, message: 'Corruption report filed' });
});

app.get('/api/corruption/reports', (req, res) => {
  res.json({ success: true, data: [] });
});

app.listen(PORT, () => {
  console.log(`🚀 Corruption Service running on port ${PORT}`);
});
