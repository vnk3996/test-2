'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change ENUM from (admin, manager, viewer) to (admin, manager, customer)
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'viewer', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    });

    // Update existing viewer records to customer
    await queryInterface.sequelize.query(
      `UPDATE users SET role = 'customer' WHERE role = 'viewer'`
    );

    // Remove old 'viewer' value from ENUM
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'customer', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    });

    await queryInterface.sequelize.query(
      `UPDATE users SET role = 'viewer' WHERE role = 'customer'`
    );

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    });
  },
};
