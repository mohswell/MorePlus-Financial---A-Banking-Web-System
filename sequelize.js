const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('banking_app', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
