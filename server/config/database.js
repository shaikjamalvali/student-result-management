const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize based on environment
const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
        define: {
            timestamps: true,
            freezeTableName: true
        }
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '../database.sqlite'),
        logging: console.log,
        define: {
            timestamps: true,
            freezeTableName: true
        }
    });

module.exports = sequelize;
