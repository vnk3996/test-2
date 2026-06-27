const { Worker } = require('worker_threads');
const path = require('path');
const Order = require('../models/order.model');

const generateSalesReport = async () => {
    // Fetch all orders (raw for speed)
    const orders = await Order.findAll({ raw: true });

    // Offload computation to a worker thread
    return new Promise((resolve, reject) => {
        console.log(__dirname);
        const worker = new Worker(
            path.join(__dirname, '../workers/salesReportWorker.js'),
            { workerData: orders }
        );
console.log(`[Main] Thread ID: 0 (main). Spawning worker...`);
        // worker.on('message', resolve);
        worker.on('message', (result) => {
            console.log(`[Main] Received result from worker`);
            resolve(result);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
    });
};

const generateSeries = async () => {
    
};

module.exports = { generateSalesReport, generateSeries };
