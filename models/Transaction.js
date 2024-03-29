// models/Transaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import Sequelize instance

const Transaction = sequelize.define('Transaction', {
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.ENUM('debit', 'credit'),
    allowNull: false
  }
});

module.exports = Transaction;
