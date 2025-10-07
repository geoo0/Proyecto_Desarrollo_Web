import 'dotenv/config';

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpires: process.env.JWT_EXPIRES || '2h',
  bcryptRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  appName: process.env.APP_NAME || 'SIGLAD',
};
