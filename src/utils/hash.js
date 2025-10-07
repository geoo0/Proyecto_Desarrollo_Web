import bcrypt from 'bcrypt';
import { config } from '../config/env.js';

export const hash = async (plain) => bcrypt.hash(plain, config.bcryptRounds);
export const compare = async (plain, hashed) => bcrypt.compare(plain, hashed);
