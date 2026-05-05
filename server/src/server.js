const path = require('path');
const fs = require('fs');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Detect Railway/production environment — triple-checked so a NODE_ENV typo
// (e.g. "producation") never causes the server to bind to localhost on Railway.
const isProduction =
  process.env.NODE_ENV === 'production' ||
  !!process.env.RAILWAY_ENVIRONMENT ||
  !!process.env.RAILWAY_SERVICE_NAME ||
  !!process.env.RAILWAY_PROJECT_ID;

const host = isProduction ? '0.0.0.0' : 'localhost';

// Diagnostics
const distPath = path.resolve(__dirname, '../../dist');
console.log(`🔍  Checking static files at: ${distPath}`);
if (fs.existsSync(distPath)) {
  console.log('✅  Dist folder found.');
  const files = fs.readdirSync(distPath);
  console.log(`📄  Files in dist: ${files.join(', ')}`);
} else {
  console.log('❌  Dist folder NOT found — frontend will not be served.');
}

// ── Start HTTP server IMMEDIATELY so Railway health check passes ──────────────
// The frontend will render even if the database is still connecting.
const server = app.listen(PORT, host, () => {
  console.log(`🚀  Server running on http://${host}:${PORT}`);
  if (isProduction) {
    console.log(`🌐  Publicly accessible on Railway at port ${PORT}`);
  }
});

// ── Connect to database in the background ─────────────────────────────────────
const connectDB = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('✅  Database connected.');

      if (process.env.FORCE_DB_RESET === 'true') {
        console.log('⚠️  FORCE_DB_RESET detected — wiping and recreating database...');
        await sequelize.sync({ force: true });
        console.log('✅  Database reset completed.');
      } else {
        await sequelize.sync({ alter: true });
        console.log('✅  Database synced.');
      }
      return; // success
    } catch (err) {
      console.error(`❌  DB connection attempt ${attempt}/${retries} failed:`, err.message);
      if (attempt < retries) {
        console.log(`⏳  Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('❌  All DB connection attempts failed. API endpoints will not work, but the frontend is still served.');
      }
    }
  }
};

connectDB();

