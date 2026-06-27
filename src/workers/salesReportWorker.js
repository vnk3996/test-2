const { parentPort, workerData, threadId } = require('worker_threads');

console.log(`[Worker] Running in thread #${threadId}`);
console.log(`[Worker] Processing ${workerData.length} orders...`);

// Simulate heavy computation on the orders data
const orders = workerData;

const report = {
    totalRevenue: 0,
    orderCount: orders.length,
    byStatus: {},
    topCities: {},
    dailyRevenue: {},
};

for (const order of orders) {
    const amount = parseFloat(order.totalAmount);

    // Total revenue
    report.totalRevenue += amount;

    // Count by status
    report.byStatus[order.status] = (report.byStatus[order.status] || 0) + 1;

    // Revenue by city
    report.topCities[order.city] = (report.topCities[order.city] || 0) + amount;

    // Daily revenue
    const day = new Date(order.createdAt).toISOString().split('T')[0];
    report.dailyRevenue[day] = (report.dailyRevenue[day] || 0) + amount;
}

// Sort top cities
report.topCities = Object.entries(report.topCities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, revenue]) => ({ city, revenue: revenue.toFixed(2) }));

report.totalRevenue = report.totalRevenue.toFixed(2);
report.averageOrderValue = (report.totalRevenue / report.orderCount).toFixed(2);
console.log(`[Worker] Done. Thread #${threadId} sending result back.`);

parentPort.postMessage(report);
