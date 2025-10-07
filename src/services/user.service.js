import { pool } from '../db/pool.js';

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, name, email, password_hash, role, is_active
     FROM public.users
     WHERE email=$1 LIMIT 1`,
    [email]
  );
  return rows[0] || null;
}

export async function insertAudit({ userId=null, userEmail=null, ip=null, operation, result=null }) {
  await pool.query(
    `INSERT INTO public.audit_logs (user_id, user_email, ip, operation, result)
     VALUES ($1, $2, $3::inet, $4, $5)`,
    [userId, userEmail, ip, operation, result]
  );
}
