const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model');
const { getImageUrl } = require('../utils/imageUrl');
const AppError = require('../utils/AppError');
const redisClient = require('../config/redis');
const logger = require('../config/logger');

const CACHE_PREFIX = 'products:list:';
const CACHE_TTL = 3600; // 1 hour in seconds

const createProduct = async (data, userId) => {
    const product = await Product.create({
        ...data,
        createdBy: userId,
    });

    // Invalidate all product list cache pages
    await invalidateProductCache();

    return product;
};

const listProducts = async (page = 1, limit = 10) => {
    const cacheKey = `${CACHE_PREFIX}${page}:${limit}`;

    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        logger.debug({ cacheKey }, 'Product list served from cache');
        return JSON.parse(cached);
    }

    // Cache miss — fetch from DB
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
        where: { status: 'active' },
        include: [
            {
                model: ProductImage,
                as: 'images',
                attributes: ['id', 'filename', 'sortOrder'],
                required: false,
            },
        ],
        limit,
        offset,
        order: [
            ['createdAt', 'DESC'],
            [{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC'],
        ],
    });

    const products = rows.map((p) => {
        const json = p.toJSON();
        json.images = json.images.map((img) => ({
            id: img.id,
            url: getImageUrl(img.filename),
            sortOrder: img.sortOrder,
        }));
        return json;
    });

    const result = {
        products,
        pagination: {
            page,
            limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
        },
    };

    // Store in cache
    await redisClient.set(cacheKey, JSON.stringify(result), { EX: CACHE_TTL });
    logger.debug({ cacheKey }, 'Product list cached');

    return result;
};

const getProductById = async (id) => {
    const product = await Product.findByPk(id, {
        include: [
            {
                model: ProductImage,
                as: 'images',
                attributes: ['id', 'filename', 'sortOrder'],
            },
        ],
        order: [[{ model: ProductImage, as: 'images' }, 'sortOrder', 'ASC']],
    });

    if (!product) {
        throw AppError.notFound('Product not found');
    }

    const json = product.toJSON();
    json.images = json.images.map((img) => ({
        id: img.id,
        url: getImageUrl(img.filename),
        sortOrder: img.sortOrder,
    }));

    return json;
};

const deleteProduct = async (id) => {
    const product = await Product.findByPk(id);

    if (!product) {
        throw AppError.notFound('Product not found');
    }

    await product.destroy();

    // Invalidate cache after deletion
    await invalidateProductCache();

    return { message: 'Product deleted successfully' };
};

/**
 * Invalidate all product list cache keys
 */
async function invalidateProductCache() {
    const keys = await redisClient.keys(`${CACHE_PREFIX}*`);
    if (keys.length > 0) {
        await redisClient.del(keys);
        logger.debug({ keysRemoved: keys.length }, 'Product cache invalidated');
    }
}

module.exports = { createProduct, listProducts, getProductById, deleteProduct };
