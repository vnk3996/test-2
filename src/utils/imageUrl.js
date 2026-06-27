/**
 * Construct full image URL from a filename (S3 key)
 * URL format: https://{bucket}.s3.{region}.amazonaws.com/{filename}
 */
function getImageUrl(filename) {
  if (!filename) return null;
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
}

module.exports = { getImageUrl };
