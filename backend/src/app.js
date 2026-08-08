import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import userRoutes from './routes/user.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const frontendRoot = path.join(projectRoot, 'frontend');

// O catalogo referencia imagens de varios CDNs externos e a pagina carrega
// fontes/icones externos (Google Fonts, Font Awesome) e embeds do YouTube,
// entao o CSP libera https: amplamente em vez de listar cada dominio.
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'https:', 'data:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      scriptSrc: ["'self'"],
      frameSrc: ["'self'", 'https://www.youtube.com'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  // "no-referrer" (padrao do helmet) faz o player embutido do YouTube
  // recusar reproducao com "Erro 153" em varios videos.
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(express.json());
app.use(cors());
app.use(express.static(frontendRoot));

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

app.use('/api', notFoundHandler);
app.use(errorHandler);

export default app;
