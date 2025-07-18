const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite with Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: console.log, // Enable SQL query logging
    define: {
        // Add timestamps to all tables
        timestamps: true,
        // Prevent sequelize from pluralizing table names
        freezeTableName: true
    }
});

module.exports = sequelize;
