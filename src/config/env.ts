import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  DRIVER_EMAIL: string;
  DRIVER_PASSWORD: string;
  RIDER_EMAIL: string;
  RIDER_PASSWORD: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  ALLOWED_ORIGINS: string;
  EMAIL_SENDER: {
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_PORT: string;
    SMTP_HOST: string;
    SMTP_FROM: string;
  };
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
}

const loadEnvVariables = (): EnvConfig => {
  const getEnv = (key: string, defaultValue = ""): string => {
    const value = process.env[key];
    if (!value && !defaultValue && process.env.NODE_ENV === "production") {
      // eslint-disable-next-line no-console
      console.error(`❌ Warning: Missing required environment variable: ${key}`);
    }
    return value || defaultValue;
  };

  return {
    PORT: getEnv("PORT", "5000"),
    DB_URL: getEnv("DB_URL"),
    NODE_ENV: (getEnv("NODE_ENV", "development") as "development" | "production"),
    BCRYPT_SALT_ROUND: getEnv("BCRYPT_SALT_ROUND", "12"),
    JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET", "secret"),
    JWT_ACCESS_EXPIRES: getEnv("JWT_ACCESS_EXPIRES", "1d"),
    JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "refresh_secret"),
    JWT_REFRESH_EXPIRES: getEnv("JWT_REFRESH_EXPIRES", "30d"),
    SUPER_ADMIN_EMAIL: getEnv("SUPER_ADMIN_EMAIL"),
    SUPER_ADMIN_PASSWORD: getEnv("SUPER_ADMIN_PASSWORD"),
    ADMIN_EMAIL: getEnv("ADMIN_EMAIL"),
    ADMIN_PASSWORD: getEnv("ADMIN_PASSWORD"),
    DRIVER_EMAIL: getEnv("DRIVER_EMAIL"),
    DRIVER_PASSWORD: getEnv("DRIVER_PASSWORD"),
    RIDER_EMAIL: getEnv("RIDER_EMAIL"),
    RIDER_PASSWORD: getEnv("RIDER_PASSWORD"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
    EXPRESS_SESSION_SECRET: getEnv("EXPRESS_SESSION_SECRET", "session_secret"),
    FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:3000"),
    ALLOWED_ORIGINS: getEnv("ALLOWED_ORIGINS", "http://localhost:3000"),
    EMAIL_SENDER: {
      SMTP_USER: getEnv("SMTP_USER"),
      SMTP_PASS: getEnv("SMTP_PASS"),
      SMTP_PORT: getEnv("SMTP_PORT", "587"),
      SMTP_HOST: getEnv("SMTP_HOST"),
      SMTP_FROM: getEnv("SMTP_FROM"),
    },
    REDIS_HOST: getEnv("REDIS_HOST", "localhost"),
    REDIS_PORT: getEnv("REDIS_PORT", "6379"),
    REDIS_USERNAME: getEnv("REDIS_USERNAME", "default"),
    REDIS_PASSWORD: getEnv("REDIS_PASSWORD", ""),
  };
};

export const envVars = loadEnvVariables();
