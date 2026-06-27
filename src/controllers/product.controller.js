const productService = require('../services/product.service');

const create = async (req, res) => {
    const product = await productService.createProduct(req.body, req.user.id);
    res.status(201).json({ success: true, product });
};

const list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await productService.listProducts(page, limit);
    res.json({ success: true, ...result });
};

const getById = async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
};

const remove = async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, ...result });
};

module.exports = { create, list, getById, remove };
