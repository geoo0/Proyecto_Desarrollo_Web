cp .env.example .env
# edita DATABASE_URL (tu Postgres) y JWT_SECRET

npm ci
npm run dev
# abrir http://localhost:3000/login.html  (sirve desde /src/public)
# probar POST /api/auth/login y GET /api/auth/me
