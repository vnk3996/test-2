'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            totalAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            fullName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            addressLine1: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            addressLine2: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            postalCode: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING(100),
                allowNull: false,
                defaultValue: 'India',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    },
};
