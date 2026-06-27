const { Worker } = require('bullmq');
const { sendEmail } = require('../../services/email.service');
const logger = require('../../config/logger');

const emailWorker = new Worker(
    'email',
    async (job) => {
        const { to, subject, html } = job.data;
        logger.info({ jobId: job.id, to, subject }, 'Processing email job');
        await sendEmail(to, subject, html);
        logger.info({ jobId: job.id }, 'Email sent successfully');
    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);

emailWorker.on('failed', (job, err) => {
    logger.error({ jobId: job.id, err }, 'Email job failed');
});

module.exports = emailWorker;
