const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_URL || process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/task_manager',
  {
    dialect: 'mysql',
    logging: false,
    dialectOptions:
      process.env.NODE_ENV === 'production'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  }
);

module.exports = sequelize;
