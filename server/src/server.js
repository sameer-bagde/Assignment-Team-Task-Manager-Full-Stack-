require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connected.');

    // sync({ alter: true }) safely updates existing tables without dropping data
    await sequelize.sync({ alter: true });
    console.log('✅  Database synced.');

    const host = '0.0.0.0';
    app.listen(PORT, host, () => {
      console.log(`🚀  Server running on http://${host}:${PORT}`);
      console.log(`✅  Healthcheck available at http://${host}:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    process.exit(1);
  }
};

start();
