// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import { errorHandler } from './middlewares/error.js';
import { pool } from './db/pool.js';

const app = express();

// 🔓 Helmet sin CSP (solo para PRUEBAS). Evita bloqueos de inline scripts/CDN.
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir estáticos con ruta absoluta (más robusto en Render)
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'SIGLAD Auth', health: 'green' });
});

// Diagnóstico de DB
app.get('/api/debug/db', async (req, res) => {
  try {
    const r = await pool.query('SELECT now() AS ts');
    res.json({ ok: true, db: r.rows[0] });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// Manejo de errores (al final)
app.use(errorHandler);

export default app;
