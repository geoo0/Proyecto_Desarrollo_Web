import * as svc from '../services/users.service.js';
import { ok } from '../utils/response.js';
import { insertAudit } from '../services/users.services.js'; // reutilizamos insertAudit del módulo 1
import { hash } from '../utils/hash.js';

export async function listUsers(req, res, next) {
  try {
    const { page = 1, pageSize = 10, search = '', onlyActive } = req.query;
    const result = await svc.listUsers({ page: Number(page), pageSize: Number(pageSize), search, onlyActive });
    return ok(res, result);
  } catch (e) { next(e); }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, role, is_active = true, password } = req.body;
    const password_hash = await hash(password);
    const user = await svc.createUser({ name, email, role, is_active, password_hash });

    await insertAudit({
      userId: req.user.sub,
      userEmail: req.user.email,
      ip: req.ip,
      operation: 'USER_CREATE',
      result: 'SUCCESS'
    });

    return ok(res, { user });
  } catch (e) {
    // si es violación de unique (correo duplicado)
    if (e?.code === '23505') {
      await insertAudit({ userId: req.user.sub, userEmail: req.user.email, ip: req.ip, operation: 'USER_CREATE', result: 'FAIL_DUPLICATE' });
      return res.status(400).json({ ok: false, error: 'Correo ya registrado' });
    }
    await insertAudit({ userId: req.user.sub, userEmail: req.user.email, ip: req.ip, operation: 'USER_CREATE', result: 'FAIL' });
    next(e);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, role, is_active, password } = req.body;

    const fields = { name, role, is_active };
    if (password) fields.password_hash = await hash(password);

    const user = await svc.updateUser(id, fields);
    await insertAudit({ userId: req.user.sub, userEmail: req.user.email, ip: req.ip, operation: 'USER_UPDATE', result: 'SUCCESS' });
    return ok(res, { user });
  } catch (e) {
    await insertAudit({ userId: req.user.sub, userEmail: req.user.email, ip: req.ip, operation: 'USER_UPDATE', result: 'FAIL' });
    next(e);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const hard = String(req.query.hard || '').toLowerCase() === 'true';

    const result = await svc.deleteUser(id, { hard });
    await insertAudit({
      userId: req.user.sub,
      userEmail: req.user.email,
      ip: req.ip,
      operation: hard ? 'USER_DELETE_HARD' : 'USER_DELETE_SOFT',
      result: 'SUCCESS'
    });

    return ok(res, { deleted: true, hard, result });
  } catch (e) {
    await insertAudit({
      userId: req.user.sub,
      userEmail: req.user.email,
      ip: req.ip,
      operation: 'USER_DELETE',
      result: 'FAIL'
    });
    next(e);
  }
}
