// utils/emailQueue.js
import Queue from 'bull';

const emailQueue = new Queue('email-queue', {
    redis: { host: '127.0.0.1', port: 6379 }
});

export default emailQueue;