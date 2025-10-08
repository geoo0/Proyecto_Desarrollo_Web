import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import {
  listUsers, createUser, updateUser, deleteUser
} from '../controllers/users.controller.js';
import {
  validateCreateUser, validateUpdateUser, validateListQuery, validateIdParam
} from '../validators/users.validators.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/', validateListQuery, listUsers);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateIdParam, validateUpdateUser, updateUser);
router.delete('/:id', validateIdParam, deleteUser);

export default router;
