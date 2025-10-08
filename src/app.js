import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/error.js';

import { pool } from './db/pool.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static('src/public'));

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

// ...
import usersRoutes from './routes/users.routes.js';
// ...
app.use('/api/users', usersRoutes);
// ...


app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
