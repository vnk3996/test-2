const { parentPort, workerData, threadId } = require('worker_threads');

// Receive message from the main thread
console.log('Worker received:', workerData);

// Simulate CPU-intensive task
function performCPUIntensiveTask() {
  // Simple example: Sum up to a large number
  let result = 0;
  for (let i = 0; i < 1_000_000; i++) {
    result += i;
  }
  return result;
}

// Perform the task
const result = performCPUIntensiveTask();

// Send the result back to the main thread
parentPort.postMessage({
  receivedData: workerData,
  calculatedSum: result,
});
