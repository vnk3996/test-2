const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ops13',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'deep70',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
