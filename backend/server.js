import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

// Local imports
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import universityRoutes from './routes/universityRoutes.js';
import communityRoutes from './routes/communityRoutes.js';

dotenv.config();
function sanitizeRequest(req, res, next) {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (/^\$/.test(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
}

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: 'https://skill-pilot-lake.vercel.app',
  credentials: true, // if you use cookies or authentication
}));
app.use(sanitizeRequest);
// Increase body size limit to 5MB (or more if needed)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
}));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/community', communityRoutes);

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  next();
});

// Serve frontend for all other routes (SPA support)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
