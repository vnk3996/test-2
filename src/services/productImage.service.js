const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const { uploadToS3, deleteFromS3 } = require('./upload.service');
const { getImageUrl } = require('../utils/imageUrl');
const AppError = require('../utils/AppError');

/**
 * Upload multiple images for a product
 */
const uploadImages = async (productId, files) => {
  const product = await Product.findByPk(productId);
  if (!product) throw AppError.notFound('Product not found');

  const images = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = await uploadToS3(file, productId);

    const image = await ProductImage.create({
      productId,
      filename,
      sortOrder: i,
    });

    images.push({
      id: image.id,
      url: getImageUrl(image.filename),
      sortOrder: image.sortOrder,
    });
  }

  return images;
};

/**
 * Delete a specific image
 */
const deleteImage = async (productId, imageId) => {
  const image = await ProductImage.findOne({
    where: { id: imageId, productId },
  });

  if (!image) throw AppError.notFound('Image not found');

  // Delete from S3
  await deleteFromS3(image.filename);

  // Delete from DB
  await image.destroy();

  return { message: 'Image deleted successfully' };
};

module.exports = { uploadImages, deleteImage };
