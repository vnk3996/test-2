const sequelize = require('../config/db');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const appEmitter = require('../events/emitter');
const emailQueue = require('../queues/emailQueue');

/**
 * Place a new order (customer)
 */
const placeOrder = async (userId, data) => {
  const { items, ...addressData } = data;

  // Validate products and check stock
  const products = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) {
      throw AppError.badRequest(`Product with ID ${item.productId} not found`);
    }
    if (product.status !== 'active') {
      throw AppError.badRequest(`Product "${product.name}" is not available`);
    }
    if (product.stock < item.quantity) {
      throw AppError.badRequest(`Insufficient stock for "${product.name}". Available: ${product.stock}`);
    }
    products.push({ product, quantity: item.quantity });
  }

  // Calculate total
  const totalAmount = products.reduce(
    (sum, { product, quantity }) => sum + Number(product.price) * quantity,
    0
  );

  // Create order + items in a transaction
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.create(
      {
        userId,
        totalAmount,
        ...addressData,
      },
      { transaction }
    );

    // Create order items and reduce stock
    for (const { product, quantity } of products) {
      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity,
          price: product.price, // snapshot price
        },
        { transaction }
      );

      // Reduce stock
      product.stock -= quantity;
      await product.save({ transaction });
    }

    await transaction.commit();

    // Fetch user email for notification
    const user = await User.findByPk(userId, { attributes: ['email', 'name'] });

    // Emit event for logging/analytics
    appEmitter.emit('order:created', { orderId: order.id, userId });

    // Queue order confirmation email
    await emailQueue.add('order-confirmation', {
      to: user.email,
      subject: `Order #${order.id} Confirmed!`,
      html: `<h1>Thank you, ${user.name}!</h1><p>Your order #${order.id} has been placed successfully.</p><p>Total: ₹${totalAmount}</p>`,
    });

    // Fetch order with items for response
    return getOrderWithItems(order.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get my orders (customer, paginated)
 */
const getMyOrders = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    orders: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get my single order detail (customer)
 */
const getMyOrderById = async (userId, orderId) => {
  const order = await getOrderWithItems(orderId);

  if (!order) throw AppError.notFound('Order not found');
  if (order.userId !== userId) throw AppError.forbidden('Not your order');

  return order;
};

/**
 * Cancel order (customer, only if pending)
 */
const cancelOrder = async (userId, orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }],
  });

  if (!order) throw AppError.notFound('Order not found');
  if (order.userId !== userId) throw AppError.forbidden('Not your order');
  if (order.status !== 'pending') {
    throw AppError.badRequest('Only pending orders can be cancelled');
  }

  const transaction = await sequelize.transaction();

  try {
    // Restore stock for each item
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (product) {
        product.stock += item.quantity;
        await product.save({ transaction });
      }
    }

    order.status = 'cancelled';
    await order.save({ transaction });

    await transaction.commit();

    // Emit event for logging
    appEmitter.emit('order:cancelled', { orderId, userId });

    return { message: 'Order cancelled successfully', order };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get all orders (admin/manager, paginated)
 */
const getAllOrders = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Order.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    orders: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Get any order detail (admin/manager)
 */
const getOrderById = async (orderId) => {
  const order = await getOrderWithItems(orderId);
  if (!order) throw AppError.notFound('Order not found');
  return order;
};

/**
 * Update order status (admin/manager)
 */
const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw AppError.notFound('Order not found');

  order.status = status;
  await order.save();

  // Emit event for logging
  appEmitter.emit('order:statusChanged', { orderId, status });

  return { message: 'Order status updated', order };
};

/**
 * Helper: fetch order with items and product names
 */
async function getOrderWithItems(orderId) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  });

  return order ? order.toJSON() : null;
}

module.exports = { placeOrder, getMyOrders, getMyOrderById, cancelOrder, getAllOrders, getOrderById, updateOrderStatus };
