const { Transform } = require('stream');

class CsvTransform extends Transform {
    constructor() {
        super({ objectMode: true }); // input = objects, output = strings
        this.headerSent = false;
    }

    _transform(row, encoding, callback) {
        if (row.id % 500 === 0) {
            const used = process.memoryUsage();
            console.log(`Row #${row.id} | RSS: ${(used.rss / 1024 / 1024).toFixed(1)}MB | Heap: ${(used.heapUsed / 1024 / 1024).toFixed(1)}MB`);
        }
        // Send CSV header on the very first row
        if (!this.headerSent) {
            this.push('Order ID,Customer,Phone,Status,Total,City,State,Date\n');
            this.headerSent = true;
        }

        // Convert order object to a CSV line
        const line = [
            row.id,
            `"${row.fullName}"`,
            `"${row.phone}"`,
            row.status,
            row.totalAmount,
            `"${row.city}"`,
            `"${row.state}"`,
            row.createdAt.toISOString(),
        ].join(',');

        this.push(line + '\n');
        callback(); // signal: ready for next row
    }
}

module.exports = CsvTransform;
