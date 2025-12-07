import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'employment-service',
    timestamp: new Date().toISOString(),
  });
});

// Job endpoints
app.get('/api/jobs', (req, res) => {
  res.json({
    success: true,
    data: {
      jobs: [
        {
          id: '1',
          title: 'Software Developer',
          company: 'Tech Corp',
          location: 'Mumbai',
          salary: '₹8-12 LPA',
          skills: ['JavaScript', 'React', 'Node.js'],
        },
        {
          id: '2',
          title: 'Data Analyst',
          company: 'Analytics Inc',
          location: 'Bangalore',
          salary: '₹6-10 LPA',
          skills: ['Python', 'SQL', 'Excel'],
        },
      ],
      total: 2,
    },
  });
});

app.post('/api/jobs/apply', (req, res) => {
  res.json({ success: true, message: 'Application submitted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Employment Service running on port ${PORT}`);
});
