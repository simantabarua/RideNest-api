import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  dbUri: process.env.DB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};
