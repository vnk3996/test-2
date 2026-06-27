const { pipeline } = require('stream/promises');
const { Readable } = require('stream');
const Order = require('../models/order.model');
const CsvTransform = require('../streams/csvTransform');
const logger = require('../config/logger');

const exportOrdersCsv = async (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');

    const orderStream = new Readable({
        objectMode: true,
        read() {
            const self = this;
            const offset = self._offset || 0;

            Order.findAll({
                order: [['createdAt', 'DESC']],
                limit: 100,
                offset,
                raw: true,
            })
                .then((orders) => {
                    if (orders.length === 0) {
                        self.push(null); // no more data
                    } else {
                        for (const order of orders) {
                            self.push(order);
                        }
                        self._offset = offset + 100;
                    }
                })
                .catch((err) => {
                    self.destroy(err);
                });
        },
    });

    const csvTransform = new CsvTransform();

    try {
        await pipeline(orderStream, csvTransform, res);
    } catch (err) {
        // Client disconnected or stream error — just log it
        logger.error(err, 'CSV export stream error');
    }
};

module.exports = { exportOrdersCsv };
