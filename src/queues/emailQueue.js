const { Queue } = require('bullmq');

const emailQueue = new Queue('email', {
    connection: {
        host: 'localhost', // or parse from REDIS_URL
        port: 6379,
    },
});

module.exports = emailQueue;
