const { Sequelize } = require('sequelize');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000
    },
    retry: {
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
        /TimeoutError/,
        /PROTOCOL_CONNECTION_LOST/
      ],
      max: 3
    }
  }
);

module.exports = sequelize;
