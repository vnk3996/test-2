const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const path = require('path');
const s3Client = require('../config/s3');

/**
 * Upload a file to S3 using @aws-sdk/lib-storage (stream-based, auto multipart)
 * @param {Object} file - multer file object (buffer, mimetype, originalname)
 * @param {number} productId - product ID for folder structure
 * @returns {string} S3 key (filename stored in DB)
 */
const uploadToS3 = async (file, productId) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const key = `${process.env.AWS_S3_PREFIX}/products/${productId}/${Date.now()}${ext}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        },
        // Auto multipart: splits into 5MB chunks for large files
        queueSize: 4,          // concurrent upload parts
        partSize: 5 * 1024 * 1024,  // 5MB per part
    });

    await upload.done();
    return key;
};

/**
 * Delete a file from S3
 * @param {string} key - S3 key to delete
 */
const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    await s3Client.send(command);
};

module.exports = { uploadToS3, deleteFromS3 };
