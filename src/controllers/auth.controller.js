import { findUserByEmail, insertAudit } from '../services/user.services.js';
import { compare } from '../utils/hash.js';
import { signJwt } from '../utils/jwt.js';
import { ok } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      await insertAudit({ userEmail: email, ip: req.ip, operation: 'LOGIN', result: 'FAIL' });
      return res.status(401).json({ ok:false, error: 'Usuario o contraseña incorrecta' });
    }
    if (!user.is_active) {
      await insertAudit({ userId: user.id, userEmail: user.email, ip: req.ip, operation: 'LOGIN', result: 'INACTIVE' });
      return res.status(403).json({ ok:false, error: 'Usuario deshabilitado' });
    }

    const valid = await compare(password, user.password_hash);
    if (!valid) {
      await insertAudit({ userId: user.id, userEmail: user.email, ip: req.ip, operation: 'LOGIN', result: 'FAIL' });
      return res.status(401).json({ ok:false, error: 'Usuario o contraseña incorrecta' });
    }

    const token = signJwt({ sub: user.id, role: user.role, email: user.email, name: user.name });
    await insertAudit({ userId: user.id, userEmail: user.email, ip: req.ip, operation: 'LOGIN', result: 'SUCCESS' });

    return ok(res, { token, role: user.role, expiresIn: process.env.JWT_EXPIRES || '2h' });
  } catch (e) {
    next(e);
  }
}

export async function me(req, res) {
  return ok(res, { user: req.user });
}
