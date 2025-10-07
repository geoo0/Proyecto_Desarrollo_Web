import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const signJwt = (payload, options = {}) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpires, ...options });

export const verifyJwt = (token) => jwt.verify(token, config.jwtSecret);
