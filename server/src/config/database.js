const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {},
  }
);

module.exports = sequelize;
