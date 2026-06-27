const productImageService = require('../services/productImage.service');
const AppError = require('../utils/AppError');

const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw AppError.badRequest('No images provided');
  }

  const images = await productImageService.uploadImages(req.params.id, req.files);
  res.status(201).json({ success: true, images });
};

const deleteImage = async (req, res) => {
  const result = await productImageService.deleteImage(req.params.id, req.params.imageId);
  res.json({ success: true, ...result });
};

module.exports = { uploadImages, deleteImage };
