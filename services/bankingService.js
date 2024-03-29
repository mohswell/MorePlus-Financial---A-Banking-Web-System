// services/bankingService.js

const { User, Account, Transaction } = require('../models');

async function createAccount(userId, accountNumber) {
    try {
        // Create an account for the user
        const account = await Account.create({ userId, accountNumber });
        return account;
    } catch (error) {
        throw new Error('Error creating account: ' + error.message);
    }
}

async function makeTransaction(userId, accountId, amount, description, type) {
    try {
        // Make a transaction for the user's account
        const transaction = await Transaction.create({ userId, accountId, amount, description, type });
        return transaction;
    } catch (error) {
        throw new Error('Error making transaction: ' + error.message);
    }
}

async function getAccountInformation(userId) {
    try {
        // Retrieve user's account information including associated accounts
        const user = await User.findByPk(userId, { include: Account });
        return user;
    } catch (error) {
        throw new Error('Error getting account information: ' + error.message);
    }
}

module.exports = { createAccount, makeTransaction, getAccountInformation };
