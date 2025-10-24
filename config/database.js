const { Sequelize } = require('sequelize');

// Load .env in non-production so local dev can use a .env file without exposing creds in prod
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

// If a full DATABASE_URL is provided (e.g. from Aiven), prefer it.
// Example: mysql://user:pass@host:port/dbname?ssl-mode=REQUIRED
const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL;

if (DATABASE_URL) {
  // For hosts that require SSL, the connection string may include ssl-mode=REQUIRED.
  // If you have to allow self-signed certs, set DB_SSL_ALLOW_SELF_SIGNED=true in env.
  const allowSelfSigned = process.env.DB_SSL_ALLOW_SELF_SIGNED === 'true';
  const dialectOptions = {};

  // If the URL includes ssl-mode or the user requested SSL behavior, set dialectOptions.ssl
  if (DATABASE_URL.includes('ssl-mode') || process.env.DB_SSL === 'true' || allowSelfSigned) {
    dialectOptions.ssl = { rejectUnauthorized: !allowSelfSigned };
  }

  const sequelize = new Sequelize(DATABASE_URL, {
    dialectOptions,
    // pool sizing can be tuned via DB_POOL_MAX env var. Keep modest defaults for hosted DBs.
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });

  module.exports = sequelize;
} else {
  // Read DB credentials from env vars with sensible defaults for local development
  const DB_NAME = process.env.DB_NAME || 'backend_variety';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASS = process.env.DB_PASS || '';
  const DB_HOST = process.env.DB_HOST || '127.0.0.1';
  const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

  // In production we require explicit credentials to be set (no silent defaults)
  if (process.env.NODE_ENV === 'production') {
    if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
      console.error('Database credentials are not fully specified in production. Please set DATABASE_URL or DB_NAME/DB_USER/DB_PASS/DB_HOST env vars.');
      process.exit(1);
    }
  }

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    pool: {
      max: Number(process.env.DB_POOL_MAX) || 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false,
  });

  module.exports = sequelize;
}
