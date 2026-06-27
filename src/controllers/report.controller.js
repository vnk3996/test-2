const reportService = require('../services/report.service');

const salesReport = async (req, res) => {
    const report = await reportService.generateSalesReport();
    res.json({ success: true, report });
};

const testWorker = async (req, res) => {
    const report = await reportService.generateSeries();
    res.json({ success: true, report });
};

module.exports = { salesReport, testWorker };
