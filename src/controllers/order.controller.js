const orderService = require('../services/order.service');

// Customer endpoints
const placeOrder = async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  res.status(201).json({ success: true, order });
};

const getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await orderService.getMyOrders(req.user.id, page, limit);
  res.json({ success: true, ...result });
};

const getMyOrderById = async (req, res) => {
  const order = await orderService.getMyOrderById(req.user.id, parseInt(req.params.id));
  res.json({ success: true, order });
};

const cancelOrder = async (req, res) => {
  const result = await orderService.cancelOrder(req.user.id, parseInt(req.params.id));
  res.json({ success: true, ...result });
};

// Admin/Manager endpoints
const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await orderService.getAllOrders(page, limit);
  res.json({ success: true, ...result });
};

const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(parseInt(req.params.id));
  res.json({ success: true, order });
};

const updateOrderStatus = async (req, res) => {
  const result = await orderService.updateOrderStatus(parseInt(req.params.id), req.body.status);
  res.json({ success: true, ...result });
};

module.exports = { placeOrder, getMyOrders, getMyOrderById, cancelOrder, getAllOrders, getOrderById, updateOrderStatus };
