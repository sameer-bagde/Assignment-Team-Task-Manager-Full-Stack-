require('dotenv').config();
const { sequelize } = require('../models');

const reset = async () => {
  try {
    console.log('⚠️  Resetting database...');
    await sequelize.authenticate();
    // force: true drops all tables and recreates them
    await sequelize.sync({ force: true });
    console.log('✅  Database cleared and recreated successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌  Failed to reset database:', err);
    process.exit(1);
  }
};

reset();
