import { verifyJwt } from '../utils/jwt.js';
import { unauthorized, forbidden } from '../utils/response.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');
  if (!token) return unauthorized(res, 'No token provided');
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return unauthorized(res);
    if (!roles.includes(req.user.role)) return forbidden(res, 'Insufficient role');
    next();
  }
}
