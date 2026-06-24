import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import userRoutes from './routes/user.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const frontendRoot = path.join(projectRoot, 'frontend');

app.use(express.json());
app.use(cors());
app.use(express.static(frontendRoot));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const healthHandler = (req, res) => {
  res.json({ status: 'API running', timestamp: new Date() });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages/home/index.html'));
});

const PORT = Number(process.env.PORT) || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set a different PORT in backend/.env or stop the process using that port.`);
    process.exit(1);
  }

  console.error('Server error:', err);
  process.exit(1);
});
