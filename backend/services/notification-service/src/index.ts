import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3006;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
  });
});

// Notification endpoints
app.post('/api/notifications/send', (req, res) => {
  const { type, recipient, message } = req.body;
  console.log(`Sending ${type} notification to ${recipient}: ${message}`);
  res.json({ success: true, message: 'Notification sent' });
});

app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        type: 'complaint_update',
        message: 'Your complaint has been assigned to an officer',
        timestamp: new Date().toISOString(),
        read: false,
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Notification Service running on port ${PORT}`);
});
