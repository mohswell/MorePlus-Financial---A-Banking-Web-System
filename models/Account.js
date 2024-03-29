// models/Account.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import Sequelize instance

const Account = sequelize.define('Account', {
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    }
});

module.exports = Account;
