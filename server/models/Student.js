const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    class: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fatherMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    homeMobile: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isMotherEmployed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    motherEmployerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    motherJobPosition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isFatherEmployed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fatherEmployerName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fatherJobPosition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    hasSiblings: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    sibling1Name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sibling2Name: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Add timestamps: true to automatically handle createdAt and updatedAt
    timestamps: true
});

module.exports = Student;
