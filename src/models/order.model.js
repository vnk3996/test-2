const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        addressLine1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        addressLine2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'India',
        },
    },
    {
        tableName: 'orders',
        timestamps: true,
    }
);

module.exports = Order;
