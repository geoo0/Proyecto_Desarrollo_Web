import { Router } from 'express';
import { login, me } from '../controllers/auth.controller.js';
import { validate, loginSchema } from '../validators/auth.validators.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, me);

export default router;
