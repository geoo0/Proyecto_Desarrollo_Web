import { z } from 'zod';

const roleEnum = z.enum(['ADMIN','TRANSPORTISTA','AGENTE']);

export const listQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  search: z.string().optional(),
  onlyActive: z.string().optional()
});

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: roleEnum,
  is_active: z.boolean().optional(),
  password: z.string().min(8)
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: roleEnum.optional(),
  is_active: z.boolean().optional(),
  password: z.string().min(8).optional()
});

export function validateListQuery(req, res, next) {
  const r = listQuerySchema.safeParse(req.query);
  if (!r.success) return res.status(400).json({ ok:false, error: r.error.message });
  next();
}

export function validateCreateUser(req, res, next) {
  const r = createUserSchema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ ok:false, error: r.error.message });
  next();
}

export function validateUpdateUser(req, res, next) {
  const r = updateUserSchema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ ok:false, error: r.error.message });
  next();
}

export function validateIdParam(req, res, next) {
  // UUID simple (formato v4); si usas otro formato, ajusta regex.
  const uuidV4 = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4.test(req.params.id)) {
    return res.status(400).json({ ok:false, error:'ID inválido' });
  }
  next();
}
