'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'West Bengal', 'Rajasthan'];
    const names = ['Vinay Kapoor', 'Rahul Sharma', 'Priya Singh', 'Amit Patel', 'Sneha Gupta', 'Ravi Kumar', 'Anjali Mehta', 'Deepak Joshi'];

    const orders = [];

    for (let i = 0; i < 2000; i++) {
      const cityIndex = i % cities.length;
      orders.push({
        userId: 3, // change to a valid user ID in your DB
        totalAmount: (Math.random() * 10000 + 100).toFixed(2),
        status: statuses[i % statuses.length],
        fullName: names[i % names.length],
        phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        addressLine1: `${i + 1} Street, Sector ${(i % 50) + 1}`,
        addressLine2: i % 3 === 0 ? `Floor ${(i % 10) + 1}` : null,
        city: cities[cityIndex],
        state: states[cityIndex],
        postalCode: String(400001 + (i % 999)),
        country: 'India',
        createdAt: new Date(Date.now() - i * 3600000), // spread over time
        updatedAt: new Date(Date.now() - i * 3600000),
      });
    }

    // Insert in batches of 500
    for (let i = 0; i < orders.length; i += 500) {
      await queryInterface.bulkInsert('orders', orders.slice(i, i + 500));
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orders', null, {});
  },
};
