const path = require('path');
const fs = require('fs');
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Diagnostics
const distPath = path.resolve(__dirname, '../../dist');
console.log(`🔍  Checking static files at: ${distPath}`);
if (fs.existsSync(distPath)) {
  console.log('✅  Dist folder found.');
  const files = fs.readdirSync(distPath);
  console.log(`📄  Files in dist: ${files.join(', ')}`);
} else {
  console.log('❌  Dist folder NOT found at this path!');
}

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connected.');

    // Special check for Railway reset
    if (process.env.FORCE_DB_RESET === 'true') {
      console.log('⚠️  FORCE_DB_RESET detected! Wiping and recreating database...');
      await sequelize.sync({ force: true });
      console.log('✅  Database reset completed.');
    } else {
      // sync({ alter: true }) safely updates existing tables
      await sequelize.sync({ alter: true });
      console.log('✅  Database synced.');
    }

    const host = '0.0.0.0';
    app.listen(PORT, host, () => {
      console.log(`🚀  Server running on http://${host}:${PORT}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
};

start();
