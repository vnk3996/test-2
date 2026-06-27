const path = require('path');
const express = require('express');
const routes = require('./routes/index');
const webRoutes = require('./routes/web.routes');
const errorHandler = require('./middlewares/errorHandler');
require('./events/index');
const helmet = require('helmet');
const { Worker } = require('worker_threads');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web routes (template rendered pages)
app.use('/', webRoutes);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, '/worker.js'),
                { workerData: workerData });

    
     worker.on('message', resolve);
    
    // Listen for errors
    worker.on('error', reject);
    
    // Listen for worker exit
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });  
  })
}

// Run the worker
async function run() {
  try {
    // Send data to the worker and get the result
    const result = await runWorker('Hello from main thread!');
    console.log('Worker result:', result);
  } catch (err) {
    console.error('Worker error:', err);
  }
}

run().catch(err => console.error(err));

// Global error handler
app.use(errorHandler);

module.exports = app;
