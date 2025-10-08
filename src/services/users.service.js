import { pool } from '../db/pool.js';

// Solo campos públicos
const publicFields = `id, name, email, role, is_active, created_at, updated_at`;

export async function listUsers({ page, pageSize, search, onlyActive }) {
  const offset = (page - 1) * pageSize;
  const params = [];
  let where = '1=1';

  if (search) {
    params.push(`%${search}%`);
    where += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
  }
  if (String(onlyActive || '').toLowerCase() === 'true') {
    where += ` AND is_active = TRUE`;
  }

  const countSql = `SELECT COUNT(*)::int AS total FROM public.users WHERE ${where}`;
  const { rows: crows } = await pool.query(countSql, params);
  const total = crows[0]?.total || 0;

  params.push(pageSize, offset);
  const dataSql = `
    SELECT ${publicFields}
    FROM public.users
    WHERE ${where}
    ORDER BY created_at DESC
    LIMIT $${params.length-1} OFFSET $${params.length}
  `;
  const { rows } = await pool.query(dataSql, params);
  return { page, pageSize, total, users: rows };
}

export async function createUser({ name, email, role, is_active, password_hash }) {
  const { rows } = await pool.query(
    `INSERT INTO public.users (name, email, password_hash, role, is_active)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING ${publicFields}`,
    [name, email, password_hash, role, is_active]
  );
  return rows[0];
}

export async function updateUser(id, fields) {
  const set = [];
  const vals = [];
  let i = 1;

  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    const col = k === 'is_active' ? 'is_active'
      : k === 'name' ? 'name'
      : k === 'role' ? 'role'
      : k === 'password_hash' ? 'password_hash'
      : null;
    if (!col) continue;
    set.push(`${col} = $${i++}`);
    vals.push(v);
  }
  if (!set.length) {
    const { rows } = await pool.query(`SELECT ${publicFields} FROM public.users WHERE id=$1 LIMIT 1`, [id]);
    return rows[0];
  }
  vals.push(id);
  const { rows } = await pool.query(
    `UPDATE public.users SET ${set.join(', ')} WHERE id=$${i} RETURNING ${publicFields}`,
    vals
  );
  return rows[0];
}

export async function deleteUser(id, { hard = false } = {}) {
  if (hard) {
    const { rowCount } = await pool.query(`DELETE FROM public.users WHERE id=$1`, [id]);
    return { rowCount };
  } else {
    const { rows } = await pool.query(
      `UPDATE public.users SET is_active=false WHERE id=$1 RETURNING ${publicFields}`,
      [id]
    );
    return { user: rows[0] };
  }
}
