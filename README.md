# Node.js Ecommerce API

A production-ready RESTful ecommerce API built with Node.js, Express 5, Sequelize ORM, and MySQL. Features JWT authentication, MFA (TOTP), role-based access control, S3 image uploads, Redis caching, BullMQ email queues, CSV streaming exports, and worker threads for heavy computation.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MySQL + Sequelize ORM
- **Cache:** Redis
- **Authentication:** JWT + TOTP (MFA)
- **File Storage:** AWS S3
- **Queue:** BullMQ (Redis-backed)
- **Email:** Nodemailer
- **Logging:** Pino
- **Validation:** Joi
- **Security:** Helmet
- **Templating:** EJS

## Features

- User registration & login with JWT
- Multi-factor authentication (TOTP with QR code)
- Role-based access control (admin, manager, customer)
- Product CRUD with multi-image upload to S3
- Redis-cached product listings
- Order management with stock validation & transactions
- Async email queue (BullMQ)
- CSV export via Node.js streams (memory-efficient)
- Sales report generation via Worker Threads
- Graceful shutdown handling
- Centralized error handling with custom AppError class

---

## Project Structure

```
node-exp/
├── index.js                          # Entry point
├── package.json
├── .sequelizerc                      # Sequelize CLI paths config
├── .gitignore
├── .env-sample
├── logs/
│   └── app.log
└── src/
    ├── app.js                        # Express app setup
    ├── config/
    │   ├── db.js                     # Sequelize instance
    │   ├── logger.js                 # Pino logger
    │   ├── redis.js                  # Redis client
    │   └── s3.js                     # AWS S3 client
    ├── controllers/
    │   ├── admin.controller.js
    │   ├── auth.controller.js
    │   ├── export.controller.js
    │   ├── home.controller.js
    │   ├── mfa.controller.js
    │   ├── order.controller.js
    │   ├── product.controller.js
    │   ├── productImage.controller.js
    │   └── report.controller.js
    ├── database/
    │   ├── config.cjs                # Sequelize CLI config
    │   ├── migrations/
    │   │   ├── 20260620000001-create-users-table.cjs
    │   │   ├── 20260620000002-rename-viewer-to-customer.cjs
    │   │   ├── 20260621000003-create-product-images-table.cjs
    │   │   ├── 20260621000004-create-orders-table.cjs
    │   │   ├── 20260621000005-create-order-items-table.cjs
    │   │   └── 20260621061750-create-products-table.cjs
    │   └── seeders/
    │       ├── 20260620000001-create-admin-user.cjs
    │       └── 20260621000002-create-bulk-orders.cjs
    ├── events/
    │   ├── emitter.js                # EventEmitter singleton
    │   ├── index.js                  # Listener registration
    │   └── listeners/
    │       └── order.listener.js
    ├── middlewares/
    │   ├── authenticate.js           # JWT auth middleware
    │   ├── authorize.js              # Role-based authorization
    │   ├── errorHandler.js           # Global error handler
    │   ├── processErrorHandler.js    # Uncaught/unhandled handlers
    │   ├── upload.js                 # Multer config
    │   └── validate.js               # Joi validation middleware
    ├── models/
    │   ├── index.js
    │   ├── order.model.js
    │   ├── orderItem.model.js
    │   ├── product.model.js
    │   ├── productImage.model.js
    │   └── user.model.js
    ├── queues/
    │   ├── emailQueue.js             # BullMQ queue definition
    │   └── processors/
    │       └── emailProcessor.js     # Email worker/processor
    ├── routes/
    │   ├── index.js                  # API route aggregator
    │   ├── admin.routes.js
    │   ├── auth.routes.js
    │   ├── mfa.routes.js
    │   ├── order.routes.js
    │   ├── product.routes.js
    │   └── web.routes.js
    ├── services/
    │   ├── admin.service.js
    │   ├── auth.service.js
    │   ├── email.service.js
    │   ├── mfa.service.js
    │   ├── order.service.js
    │   ├── product.service.js
    │   ├── productImage.service.js
    │   ├── report.service.js
    │   └── upload.service.js
    ├── streams/
    │   └── csvTransform.js           # Transform stream for CSV export
    ├── utils/
    │   ├── AppError.js               # Custom error class
    │   ├── imageUrl.js               # S3 URL builder
    │   └── jwt.js                    # Token sign/verify helpers
    ├── validations/
    │   ├── admin.validation.js
    │   ├── auth.validation.js
    │   ├── mfa.validation.js
    │   ├── order.validation.js
    │   └── product.validation.js
    ├── views/
    │   └── home.ejs
    └── workers/
        └── salesReportWorker.js      # Worker thread for reports
```

---

## Setup & Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd node-exp

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env-sample .env
# Edit .env with your credentials

# 4. Run database migrations
npm run migrate

# 5. Seed admin user (optional)
npm run seed

# 6. Start the server
npm run dev    # development (with nodemon)
npm start      # production
```

---

## Environment Variables

### `.env-sample`

```env
NODE_ENV=development
PORT=3005
LOG_LEVEL=debug
LOG_PATH=./logs/app.log

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
DB_DIALECT=mysql

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=1d
```

---

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login (returns JWT or MFA temp token) |
| GET | `/api/auth/me` | Yes | Get current user profile |

### MFA

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/mfa/setup` | Yes | Generate MFA secret & QR code |
| POST | `/api/auth/mfa/verify-setup` | Yes | Verify TOTP code & enable MFA |
| POST | `/api/auth/mfa/validate` | No | Validate MFA code with temp token |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List all users |
| PUT | `/api/admin/users/:id/role` | Admin | Update user role |
| GET | `/api/admin/orders/export` | Admin | Export orders as CSV (stream) |
| GET | `/api/admin/reports/sales` | Admin | Generate sales report (worker thread) |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | No | List products (paginated, cached) |
| GET | `/api/products/:id` | No | Get product by ID |
| POST | `/api/products` | Admin/Manager | Create product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/images` | Admin/Manager | Upload images (max 5) |
| DELETE | `/api/products/:id/images/:imageId` | Admin/Manager | Delete image |

### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Customer | Place a new order |
| GET | `/api/orders/my` | Customer | Get my orders (paginated) |
| GET | `/api/orders/my/:id` | Customer | Get my order detail |
| POST | `/api/orders/:id/cancel` | Customer | Cancel pending order |
| GET | `/api/orders` | Admin/Manager | Get all orders (paginated) |
| GET | `/api/orders/:id` | Admin/Manager | Get order detail |
| PUT | `/api/orders/:id/status` | Admin/Manager | Update order status |

### Web

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Rendered home page (EJS) |
| GET | `/api` | No | API home (visit counter) |

---

## Entry Point & Config

### `index.js`

```javascript
import 'dotenv/config';
import app from './src/app.js';
import sequelize from './src/config/db.js';
import redisClient from './src/config/redis.js';
import logger from './src/config/logger.js';
import { registerProcessErrorHandlers } from './src/middlewares/processErrorHandler.js';
import './src/queues/processors/emailProcessor.js';
const PORT = process.env.PORT || 3005;

const server = app.listen(PORT, async () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
    await sequelize.authenticate();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(error, 'Connection error');
  }
});

// Register global error handlers for unhandled rejections, uncaught exceptions, signals
registerProcessErrorHandlers(server);
```

### `src/app.js`

```javascript
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import routes from './routes/index.js';
import webRoutes from './routes/web.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import './events/index.js';
import helmet from 'helmet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web routes (template rendered pages)
app.use('/', webRoutes);

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
```

### `package.json`

```json
{
  "name": "node-exp",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "migrate": "npx sequelize-cli db:migrate",
    "migrate:undo": "npx sequelize-cli db:migrate:undo",
    "migrate:undo:all": "npx sequelize-cli db:migrate:undo:all",
    "seed": "npx sequelize-cli db:seed:all",
    "seed:undo": "npx sequelize-cli db:seed:undo:all",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1073.0",
    "@aws-sdk/lib-storage": "^3.1073.0",
    "bcrypt": "^6.0.0",
    "bullmq": "^5.79.0",
    "dotenv": "^17.4.2",
    "ejs": "^6.0.1",
    "express": "^5.2.1",
    "helmet": "^8.2.0",
    "joi": "^18.2.3",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.2.0",
    "mysql2": "^3.22.5",
    "nodemailer": "^9.0.1",
    "otpauth": "^9.5.1",
    "pino": "^10.3.1",
    "pino-pretty": "^13.1.3",
    "qrcode": "^1.5.4",
    "redis": "^6.0.0",
    "sequelize": "^6.37.8"
  },
  "devDependencies": {
    "nodemon": "^3.1.14",
    "sequelize-cli": "^6.6.5"
  }
}
```

### `.sequelizerc`

```javascript
const path = require('path');

module.exports = {
  config: path.join(__dirname, 'src', 'database', 'config.cjs'),
  'models-path': path.join(__dirname, 'src', 'models'),
  'migrations-path': path.join(__dirname, 'src', 'database', 'migrations'),
  'seeders-path': path.join(__dirname, 'src', 'database', 'seeders'),
};
```

### `.gitignore`

```
node_modules/
.env
logs/
```

### `src/config/db.js`

```javascript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ops13',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'deep70',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

export default sequelize;
```

### `src/config/logger.js`

```javascript
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const transport = isProduction
  ? {
      target: 'pino/file',
      options: {
        destination: process.env.LOG_PATH || './logs/app.log',
        mkdir: true,
      },
    }
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport,
});

export default logger;
```

### `src/config/redis.js`

```javascript
import { createClient } from 'redis';
import logger from './logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error(err, 'Redis Client Error'));

export default redisClient;
```

### `src/config/s3.js`

```javascript
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
```

---

## Models

### `src/models/index.js`

```javascript
import sequelize from '../config/db.js';
import User from './user.model.js';

const db = {
  sequelize,
  User,
};

export default db;
```

### `src/models/user.model.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'manager', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    },
    mfaSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
```

### `src/models/product.model.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'products',
    timestamps: true,
  }
);

export default Product;
```

### `src/models/productImage.model.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './product.model.js';

const ProductImage = sequelize.define(
  'ProductImage',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'product_images',
    timestamps: true,
  }
);

// Relationships
Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'productId' });

export default ProductImage;
```

### `src/models/order.model.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define(
    'Order',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        fullName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        addressLine1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        addressLine2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postalCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'India',
        },
    },
    {
        tableName: 'orders',
        timestamps: true,
    }
);

export default Order;
```

### `src/models/orderItem.model.js`

```javascript
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Order from './order.model.js';
import Product from './product.model.js';

const OrderItem = sequelize.define(
    'OrderItem',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        tableName: 'order_items',
        timestamps: true,
    }
);

// Relationships
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

export default OrderItem;
```

---

## Migrations & Seeders

### `src/database/config.cjs`

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'ops13',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  },
};
```

### `src/database/migrations/20260620000001-create-users-table.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'viewer'),
        allowNull: false,
        defaultValue: 'viewer',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      mfaSecret: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      mfaEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
```

### `src/database/migrations/20260620000002-rename-viewer-to-customer.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change ENUM from (admin, manager, viewer) to (admin, manager, customer)
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'viewer', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    });

    // Update existing viewer records to customer
    await queryInterface.sequelize.query(
      `UPDATE users SET role = 'customer' WHERE role = 'viewer'`
    );

    // Remove old 'viewer' value from ENUM
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'customer'),
      allowNull: false,
      defaultValue: 'customer',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'customer', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    });

    await queryInterface.sequelize.query(
      `UPDATE users SET role = 'viewer' WHERE role = 'customer'`
    );

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'viewer'),
      allowNull: false,
      defaultValue: 'viewer',
    });
  },
};
```

### `src/database/migrations/20260621000003-create-product-images-table.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_images', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      isPrimary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('product_images');
  },
};
```

### `src/database/migrations/20260621000004-create-orders-table.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            totalAmount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
                allowNull: false,
                defaultValue: 'pending',
            },
            fullName: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            addressLine1: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            addressLine2: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            city: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            state: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            postalCode: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            country: {
                type: Sequelize.STRING(100),
                allowNull: false,
                defaultValue: 'India',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('orders');
    },
};
```

### `src/database/migrations/20260621000005-create-order-items-table.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('order_items', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'orders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('order_items');
    },
};
```

### `src/database/migrations/20260621061750-create-products-table.cjs`

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },

      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active'
      },

      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        )
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');

    // Required for PostgreSQL
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_status";'
    );
  }
};
```

### `src/database/seeders/20260620000001-create-admin-user.cjs`

```javascript
'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@example.com' });
  },
};
```

### `src/database/seeders/20260621000002-create-bulk-orders.cjs`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'West Bengal', 'Rajasthan'];
    const names = ['Vinay Kapoor', 'Rahul Sharma', 'Priya Singh', 'Amit Patel', 'Sneha Gupta', 'Ravi Kumar', 'Anjali Mehta', 'Deepak Joshi'];

    const orders = [];

    for (let i = 0; i < 2000; i++) {
      const cityIndex = i % cities.length;
      orders.push({
        userId: 3, // change to a valid user ID in your DB
        totalAmount: (Math.random() * 10000 + 100).toFixed(2),
        status: statuses[i % statuses.length],
        fullName: names[i % names.length],
        phone: `98${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
        addressLine1: `${i + 1} Street, Sector ${(i % 50) + 1}`,
        addressLine2: i % 3 === 0 ? `Floor ${(i % 10) + 1}` : null,
        city: cities[cityIndex],
        state: states[cityIndex],
        postalCode: String(400001 + (i % 999)),
        country: 'India',
        createdAt: new Date(Date.now() - i * 3600000), // spread over time
        updatedAt: new Date(Date.now() - i * 3600000),
      });
    }

    // Insert in batches of 500
    for (let i = 0; i < orders.length; i += 500) {
      await queryInterface.bulkInsert('orders', orders.slice(i, i + 500));
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('orders', null, {});
  },
};
```

---

## Middlewares

### `src/middlewares/authenticate.js`

```javascript
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Access token is missing');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  // Reject temp tokens (e.g., MFA temp tokens) — they are not access tokens
  if (decoded.purpose) {
    throw AppError.unauthorized('Invalid access token');
  }

  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password', 'mfaSecret'] },
  });

  if (!user) {
    throw AppError.unauthorized('User no longer exists');
  }

  req.user = user;
  next();
};

export default authenticate;
```

### `src/middlewares/authorize.js`

```javascript
import AppError from '../utils/AppError.js';

/**
 * Returns a middleware that checks if req.user.role is in the allowed roles.
 * Usage: authorize('admin', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw AppError.unauthorized('Not authenticated');
    }
    if (!roles.includes(req.user.role)) {
      throw AppError.forbidden('You do not have permission to perform this action');
    }
    next();
  };
};

export default authorize;
```

### `src/middlewares/errorHandler.js`

```javascript
import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Internal server error',
  });
};

export default errorHandler;
```

### `src/middlewares/processErrorHandler.js`

```javascript
import logger from '../config/logger.js';


export function registerProcessErrorHandlers(server) {
  process.on('unhandledRejection', (reason) => {
    logger.fatal(reason, 'Unhandled Rejection');
    gracefulShutdown(server, 'unhandledRejection');
  });

  process.on('uncaughtException', (err) => {
    logger.fatal(err, 'Uncaught Exception');
    gracefulShutdown(server, 'uncaughtException');
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    gracefulShutdown(server, 'SIGTERM');
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down gracefully...');
    gracefulShutdown(server, 'SIGINT');
  });
}

function gracefulShutdown(server, signal) {
  logger.info(`Graceful shutdown initiated by: ${signal}`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(1);
    });

    setTimeout(() => {
      logger.error('Forced shutdown — server did not close in time');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(1);
  }
}
```

### `src/middlewares/upload.js`

```javascript
import multer from 'multer';
import AppError from '../utils/AppError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only jpg, png, and webp images are allowed', 422), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
```

### `src/middlewares/validate.js`

```javascript
/**
 * Returns an Express middleware that validates req.body against a Joi schema.
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body || {}, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    req.body = value;
    next();
  };
};

export default validate;
```

---

## Utils

### `src/utils/AppError.js`

```javascript
/**
 * Custom application error class.
 * Distinguishes operational errors (expected, recoverable)
 * from programmer errors (bugs, unexpected).
 */
class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request') {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Not Found') {
    return new AppError(message, 404);
  }

  static conflict(message = 'Conflict') {
    return new AppError(message, 409);
  }

  static internal(message = 'Internal Server Error') {
    return new AppError(message, 500, { isOperational: false });
  }
}

export default AppError;
```

### `src/utils/imageUrl.js`

```javascript
/**
 * Construct full image URL from a filename (S3 key)
 * URL format: https://{bucket}.s3.{region}.amazonaws.com/{filename}
 */
export function getImageUrl(filename) {
  if (!filename) return null;
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
}
```

### `src/utils/jwt.js`

```javascript
import jwt from 'jsonwebtoken';
import AppError from './AppError.js';

/**
 * Sign a full access token (for authenticated sessions)
 */
export function signAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
}

/**
 * Sign a temporary token (e.g., for MFA flow)
 */
export function signTempToken(payload, expiresIn = '5m') {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a token
 * Throws AppError on failure
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw AppError.unauthorized('Token has expired');
        }
        throw AppError.unauthorized('Invalid token');
    }
}
```

---

## Validations

### `src/validations/auth.validation.js`

```javascript
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    'string.empty': 'Invalid email or password',
    'string.email': 'Invalid email or password',
    'any.required': 'Invalid email or password',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Invalid email or password',
    'any.required': 'Invalid email or password',
  }),
});
```

### `src/validations/mfa.validation.js`

```javascript
import Joi from 'joi';

export const mfaCodeSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'Code must be 6 digits',
    'string.pattern.base': 'Code must contain only numbers',
    'any.required': 'Code is required',
    'string.empty': 'Code is required',
  }),
});

export const mfaValidateSchema = Joi.object({
  tempToken: Joi.string().required().messages({
    'any.required': 'Temporary token is required',
    'string.empty': 'Temporary token is required',
  }),
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    'string.length': 'Code must be 6 digits',
    'string.pattern.base': 'Code must contain only numbers',
    'any.required': 'Code is required',
    'string.empty': 'Code is required',
  }),
});
```

### `src/validations/admin.validation.js`

```javascript
import Joi from 'joi';

export const updateRoleSchema = Joi.object({
  role: Joi.string().valid('admin', 'manager', 'customer').required().messages({
    'any.only': 'Role must be one of: admin, manager, customer',
    'any.required': 'Role is required',
  }),
});
```

### `src/validations/product.validation.js`

```javascript
import Joi from 'joi';

export const createProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),

    description: Joi.string()
        .trim()
        .optional()
        .allow(''),

    price: Joi.number()
        .positive()
        .required(),

    stock: Joi.number()
        .integer()
        .min(0)
        .required()
});
```

### `src/validations/order.validation.js`

```javascript
import Joi from 'joi';

export const placeOrderSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    'any.required': 'Full name is required',
    'string.empty': 'Full name is required',
  }),
  phone: Joi.string().min(10).max(20).required().messages({
    'any.required': 'Phone number is required',
    'string.empty': 'Phone number is required',
  }),
  addressLine1: Joi.string().max(255).required().messages({
    'any.required': 'Address line 1 is required',
    'string.empty': 'Address line 1 is required',
  }),
  addressLine2: Joi.string().max(255).optional().allow(''),
  city: Joi.string().max(100).required().messages({
    'any.required': 'City is required',
    'string.empty': 'City is required',
  }),
  state: Joi.string().max(100).required().messages({
    'any.required': 'State is required',
    'string.empty': 'State is required',
  }),
  postalCode: Joi.string().max(20).required().messages({
    'any.required': 'Postal code is required',
    'string.empty': 'Postal code is required',
  }),
  country: Joi.string().max(100).optional().default('India'),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Items are required',
    }),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('confirmed', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: confirmed, shipped, delivered, cancelled',
      'any.required': 'Status is required',
    }),
});
```

---

## Auth Module

### `src/controllers/auth.controller.js`

```javascript
import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, ...result });
};

export const login = async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, ...result });
};

export const getMe = async (req, res) => {
  const result = await authService.getMe(req.user.id);
  res.json({ success: true, ...result });
};
```

### `src/services/auth.service.js`

```javascript
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import { signAccessToken, signTempToken } from '../utils/jwt.js';

const SALT_ROUNDS = 10;

export const register = async ({ name, email, password } = {}) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw AppError.conflict('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const login = async ({ email, password } = {}) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // If MFA is enabled, return temp token instead of full access token
  if (user.mfaEnabled) {
    const tempToken = signTempToken({ id: user.id, purpose: 'mfa' });
    return { mfaRequired: true, tempToken };
  }

  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
};

export const getMe = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password', 'mfaSecret'] },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return { user };
};

export function generateToken(user) {
  return signAccessToken({ id: user.id, role: user.role });
}

function sanitizeUser(user) {
  const { password, mfaSecret, ...userData } = user.toJSON();
  return userData;
}
```

### `src/routes/auth.routes.js`

```javascript
import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
```

---

## MFA Module

### `src/controllers/mfa.controller.js`

```javascript
import * as mfaService from '../services/mfa.service.js';
import { generateToken } from '../services/auth.service.js';
import { verifyToken } from '../utils/jwt.js';
import AppError from '../utils/AppError.js';

export const setup = async (req, res) => {
  const result = await mfaService.setUp(req.user.id);
  res.json({ success: true, ...result });
};

export const verifySetup = async (req, res) => {
  const result = await mfaService.verifySetup(req.user.id, req.body.code);
  res.json({ success: true, ...result });
};

export const validate = async (req, res) => {
  const { tempToken, code } = req.body;

  const decoded = verifyToken(tempToken);

  if (decoded.purpose !== 'mfa') {
    throw AppError.unauthorized('Invalid token purpose');
  }

  // Validate TOTP code
  const user = await mfaService.validateLogin(decoded.id, code);

  // Issue full access token
  const token = generateToken(user);
  res.json({ success: true, token });
};
```

### `src/services/mfa.service.js`

```javascript
import { TOTP, Secret } from "otpauth";
import QRCode from 'qrcode';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';

const ISSUER = 'NodeExpApp';

export const setUp = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (user.mfaEnabled) throw AppError.badRequest('MFA is already enabled');

    const secret = new Secret();

    const totp = new TOTP({
        issuer: ISSUER,
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret,
    });

    // Save secret to DB (not yet enabled)
    user.mfaSecret = secret.base32;
    await user.save();

    // Generate QR code
    const otpauthUrl = totp.toString();
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    return {
        qrCode: qrCodeDataUrl,
        manualKey: secret.base32,
        otpauthUrl,
    };
}

export const verifySetup = async (userId, code) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (!user.mfaSecret) throw AppError.badRequest('MFA setup not initiated');
    if (user.mfaEnabled) throw AppError.badRequest('MFA is already enabled');

    const isValid = verifyCode(user.mfaSecret, user.email, code);
    if (!isValid) throw AppError.badRequest('Invalid code. Please try again.');

    user.mfaEnabled = true;
    await user.save();

    return { message: 'MFA enabled successfully' };
};

export const validateLogin = async (userId, code) => {
    const user = await User.findByPk(userId);
    if (!user) throw AppError.notFound('User not found');
    if (!user.mfaEnabled || !user.mfaSecret) {
        throw AppError.badRequest('MFA is not enabled for this user');
    }

    const isValid = verifyCode(user.mfaSecret, user.email, code);
    if (!isValid) throw AppError.unauthorized('Invalid MFA code');

    return user;
};

function verifyCode(base32Secret, email, code) {
    const totp = new TOTP({
        issuer: ISSUER,
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: Secret.fromBase32(base32Secret),
    });

    // window: 1 allows 1 period before/after (handles slight time drift)
    const result = totp.validate({ token: code, window: 1 });
    return result !== null;
}
```

### `src/routes/mfa.routes.js`

```javascript
import { Router } from 'express';
import { setup, verifySetup, validate } from '../controllers/mfa.controller.js';
import authenticate from '../middlewares/authenticate.js';
import validateMiddleware from '../middlewares/validate.js';
import { mfaCodeSchema, mfaValidateSchema } from '../validations/mfa.validation.js';

const router = Router();

// Requires logged-in user
router.post('/mfa/setup', authenticate, setup);
router.post('/mfa/verify-setup', authenticate, validateMiddleware(mfaCodeSchema), verifySetup);

// No auth — uses tempToken from login response
router.post('/mfa/validate', validateMiddleware(mfaValidateSchema), validate);

export default router;
```

---

## Admin Module

### `src/controllers/admin.controller.js`

```javascript
import * as adminService from '../services/admin.service.js';

export const listUsers = async (req, res) => {
  const users = await adminService.listUsers();
  res.json({ success: true, users });
};

export const updateUserRole = async (req, res) => {
  const user = await adminService.updateUserRole(req.params.id, req.body.role);
  res.json({ success: true, message: 'Role updated successfully', user });
};
```

### `src/services/admin.service.js`

```javascript
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';

const VALID_ROLES = ['admin', 'manager', 'customer'];

export const listUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  return users;
};

export const updateUserRole = async (userId, newRole) => {
  if (!VALID_ROLES.includes(newRole)) {
    throw AppError.badRequest(`Invalid role. Must be one of: ${VALID_ROLES.join(', ')}`);
  }

  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  user.role = newRole;
  await user.save();

  return user;
};
```

### `src/routes/admin.routes.js`

```javascript
import { Router } from 'express';
import { listUsers, updateUserRole } from '../controllers/admin.controller.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate from '../middlewares/validate.js';
import { updateRoleSchema } from '../validations/admin.validation.js';
import { exportOrdersCsv } from '../controllers/export.controller.js';
import { salesReport } from '../controllers/report.controller.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

router.get('/users', listUsers);
router.put('/users/:id/role', validate(updateRoleSchema), updateUserRole);
router.get('/orders/export', exportOrdersCsv);
router.get('/reports/sales', salesReport);
export default router;
```

---

## Product Module

### `src/controllers/product.controller.js`

```javascript
import * as productService from '../services/product.service.js';

export const create = async (req, res) => {
    const product = await productService.createProduct(req.body, req.user.id);
    res.status(201).json({ success: true, product });
};

export const list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await productService.listProducts(page, limit);
    res.json({ success: true, ...result });
};

export const getById = async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
};

export const remove = async (req, res) => {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, ...result });
};
```

### `src/services/product.service.js`

```javascript
import Product from '../models/product.model.js';
import ProductImage from '../models/productImage.model.js';
import { getImageUrl } from '../utils/imageUrl.js';
import AppError from '../utils/AppError.js';
import redisClient from '../config/redis.js';
import logger from '../config/logger.js';

const CACHE_PREFIX = 'products:list:';
const CACHE_TTL = 3600; // 1 hour in seconds

export const createProduct = async (data, userId) => {
    const product = await Product.create({
        ...data,
        createdBy: userId,
    });

    // Invalidate all product list cache pages
    await invalidateProductCache();

    return product;
};

export const listProducts = async (page = 1, limit = 10) => {
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

export const getProductById = async (id) => {
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

export const deleteProduct = async (id) => {
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
```

### `src/controllers/productImage.controller.js`

```javascript
import * as productImageService from '../services/productImage.service.js';
import AppError from '../utils/AppError.js';

export const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw AppError.badRequest('No images provided');
  }

  const images = await productImageService.uploadImages(req.params.id, req.files);
  res.status(201).json({ success: true, images });
};

export const deleteImage = async (req, res) => {
  const result = await productImageService.deleteImage(req.params.id, req.params.imageId);
  res.json({ success: true, ...result });
};
```

### `src/services/productImage.service.js`

```javascript
import Product from '../models/product.model.js';
import ProductImage from '../models/productImage.model.js';
import { uploadToS3, deleteFromS3 } from './upload.service.js';
import { getImageUrl } from '../utils/imageUrl.js';
import AppError from '../utils/AppError.js';

/**
 * Upload multiple images for a product
 */
export const uploadImages = async (productId, files) => {
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
export const deleteImage = async (productId, imageId) => {
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
```

### `src/routes/product.routes.js`

```javascript
import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate from '../middlewares/validate.js';
import upload from '../middlewares/upload.js';
import { create, list, getById, remove } from '../controllers/product.controller.js';
import { uploadImages, deleteImage } from '../controllers/productImage.controller.js';
import { createProductSchema } from '../validations/product.validation.js';

const router = Router();

// Public routes
router.get('/', list);
router.get('/:id', getById);

// Protected routes (admin + manager)
router.post('/', authenticate, authorize('admin', 'manager'), validate(createProductSchema), create);
router.delete('/:id', authenticate, authorize('admin'), remove);

// Image routes (admin + manager)
router.post('/:id/images', authenticate, authorize('admin', 'manager'), upload.array('images', 5), uploadImages);
router.delete('/:id/images/:imageId', authenticate, authorize('admin', 'manager'), deleteImage);

export default router;
```

---

## Order Module

### `src/controllers/order.controller.js`

```javascript
import * as orderService from '../services/order.service.js';

// Customer endpoints
export const placeOrder = async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  res.status(201).json({ success: true, order });
};

export const getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await orderService.getMyOrders(req.user.id, page, limit);
  res.json({ success: true, ...result });
};

export const getMyOrderById = async (req, res) => {
  const order = await orderService.getMyOrderById(req.user.id, parseInt(req.params.id));
  res.json({ success: true, order });
};

export const cancelOrder = async (req, res) => {
  const result = await orderService.cancelOrder(req.user.id, parseInt(req.params.id));
  res.json({ success: true, ...result });
};

// Admin/Manager endpoints
export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await orderService.getAllOrders(page, limit);
  res.json({ success: true, ...result });
};

export const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(parseInt(req.params.id));
  res.json({ success: true, order });
};

export const updateOrderStatus = async (req, res) => {
  const result = await orderService.updateOrderStatus(parseInt(req.params.id), req.body.status);
  res.json({ success: true, ...result });
};
```

### `src/services/order.service.js`

```javascript
import sequelize from '../config/db.js';
import Order from '../models/order.model.js';
import OrderItem from '../models/orderItem.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import AppError from '../utils/AppError.js';
import appEmitter from '../events/emitter.js';
import emailQueue from '../queues/emailQueue.js';

/**
 * Place a new order (customer)
 */
export const placeOrder = async (userId, data) => {
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
export const getMyOrders = async (userId, page = 1, limit = 10) => {
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
export const getMyOrderById = async (userId, orderId) => {
  const order = await getOrderWithItems(orderId);

  if (!order) throw AppError.notFound('Order not found');
  if (order.userId !== userId) throw AppError.forbidden('Not your order');

  return order;
};

/**
 * Cancel order (customer, only if pending)
 */
export const cancelOrder = async (userId, orderId) => {
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

    return { message: 'Order cancelled successfully', order };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get all orders (admin/manager, paginated)
 */
export const getAllOrders = async (page = 1, limit = 10) => {
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
export const getOrderById = async (orderId) => {
  const order = await getOrderWithItems(orderId);
  if (!order) throw AppError.notFound('Order not found');
  return order;
};

/**
 * Update order status (admin/manager)
 */
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw AppError.notFound('Order not found');

  order.status = status;
  await order.save();

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
```

### `src/routes/order.routes.js`

```javascript
import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';
import validate from '../middlewares/validate.js';
import {
    placeOrder,
    getMyOrders,
    getMyOrderById,
    cancelOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} from '../controllers/order.controller.js';
import { placeOrderSchema, updateStatusSchema } from '../validations/order.validation.js';

const router = Router();

// Customer routes
router.post('/', authenticate, authorize('customer'), validate(placeOrderSchema), placeOrder);
router.get('/my', authenticate, authorize('customer'), getMyOrders);
router.get('/my/:id', authenticate, authorize('customer'), getMyOrderById);
router.post('/:id/cancel', authenticate, authorize('customer'), cancelOrder);

// Admin/Manager routes
router.get('/', authenticate, authorize('admin', 'manager'), getAllOrders);
router.get('/:id', authenticate, authorize('admin', 'manager'), getOrderById);
router.put('/:id/status', authenticate, authorize('admin', 'manager'), validate(updateStatusSchema), updateOrderStatus);

export default router;
```

---

## Events

### `src/events/emitter.js`

```javascript
import { EventEmitter } from 'events';
import logger from '../config/logger.js';
const appEmitter = new EventEmitter();

// Catch any 'error' events so they don't crash the app
appEmitter.on('error', (err) => {
    logger.error(err, 'EventEmitter error');
});

export default appEmitter;
```

### `src/events/index.js`

```javascript
// Import listeners to register them
import './listeners/order.listener.js';
```

### `src/events/listeners/order.listener.js`

```javascript
import appEmitter from '../emitter.js';
import logger from '../../config/logger.js';

//Order create event
appEmitter.on('order:created', (data) => {
    logger.info({ orderId: data.orderId, userId: data.userId }, 'New order placed');
    // Future: send confirmation email
    // Future: notify warehouse
});

appEmitter.on('order:cancelled', (data) => {
    logger.info({ orderId: data.orderId }, 'Order cancelled');
    // Future: send cancellation email
    // Future: trigger refund
})

// When order status changes
appEmitter.on('order:statusChanged', (data) => {
    logger.info({ orderId: data.orderId, status: data.status }, 'Order status updated');
    // Future: send status update email/SMS to customer
});
```

---

## Queues (Message Queue)

### `src/queues/emailQueue.js`

```javascript
import { Queue } from 'bullmq';

const emailQueue = new Queue('email', {
    connection: {
        host: 'localhost', // or parse from REDIS_URL
        port: 6379,
    },
});

export default emailQueue;
```

### `src/queues/processors/emailProcessor.js`

```javascript
import { Worker } from 'bullmq';
import { sendEmail } from '../../services/email.service.js';
import logger from '../../config/logger.js';

const emailWorker = new Worker(
    'email',
    async (job) => {
        const { to, subject, html } = job.data;
        logger.info({ jobId: job.id, to, subject }, 'Processing email job');
        await sendEmail(to, subject, html);
        logger.info({ jobId: job.id }, 'Email sent successfully');
    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
    }
);

emailWorker.on('failed', (job, err) => {
    logger.error({ jobId: job.id, err }, 'Email job failed');
});

export default emailWorker;
```

### `src/services/email.service.js`

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to, subject, html) => {
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
    });
};
```

---

## Streams

### `src/streams/csvTransform.js`

```javascript
import { Transform } from 'stream';

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

export default CsvTransform;
```

### `src/controllers/export.controller.js`

```javascript
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import Order from '../models/order.model.js';
import CsvTransform from '../streams/csvTransform.js';
import logger from '../config/logger.js';

export const exportOrdersCsv = async (req, res) => {
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
}
```

---

## Workers

### `src/workers/salesReportWorker.js`

```javascript
import { parentPort, workerData, threadId } from 'worker_threads';

console.log(`[Worker] Running in thread #${threadId}`);
console.log(`[Worker] Processing ${workerData.length} orders...`);

// Simulate heavy computation on the orders data
const orders = workerData;

const report = {
    totalRevenue: 0,
    orderCount: orders.length,
    byStatus: {},
    topCities: {},
    dailyRevenue: {},
};

for (const order of orders) {
    const amount = parseFloat(order.totalAmount);

    // Total revenue
    report.totalRevenue += amount;

    // Count by status
    report.byStatus[order.status] = (report.byStatus[order.status] || 0) + 1;

    // Revenue by city
    report.topCities[order.city] = (report.topCities[order.city] || 0) + amount;

    // Daily revenue
    const day = new Date(order.createdAt).toISOString().split('T')[0];
    report.dailyRevenue[day] = (report.dailyRevenue[day] || 0) + amount;
}

// Sort top cities
report.topCities = Object.entries(report.topCities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([city, revenue]) => ({ city, revenue: revenue.toFixed(2) }));

report.totalRevenue = report.totalRevenue.toFixed(2);
report.averageOrderValue = (report.totalRevenue / report.orderCount).toFixed(2);
console.log(`[Worker] Done. Thread #${threadId} sending result back.`);

parentPort.postMessage(report);
```

### `src/services/report.service.js`

```javascript
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../models/order.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateSalesReport = async () => {
    // Fetch all orders (raw for speed)
    const orders = await Order.findAll({ raw: true });

    // Offload computation to a worker thread
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            path.join(__dirname, '../workers/salesReportWorker.js'),
            { workerData: orders }
        );
console.log(`[Main] Thread ID: 0 (main). Spawning worker...`);
        worker.on('message', (result) => {
            console.log(`[Main] Received result from worker`);
            resolve(result);
        });
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) reject(new Error(`Worker exited with code ${code}`));
        });
    });
};
```

### `src/controllers/report.controller.js`

```javascript
import * as reportService from '../services/report.service.js';

export const salesReport = async (req, res) => {
    const report = await reportService.generateSalesReport();
    res.json({ success: true, report });
};
```

---

## Views

### `src/views/home.ejs`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      color: #38bdf8;
    }
    p {
      font-size: 1.2rem;
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .status {
      display: inline-block;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1.5rem 2rem;
      margin-top: 1rem;
    }
    .status span {
      color: #4ade80;
      font-weight: bold;
    }
    .endpoints {
      margin-top: 2rem;
      text-align: left;
      display: inline-block;
    }
    .endpoints h3 {
      color: #38bdf8;
      margin-bottom: 0.5rem;
    }
    .endpoints code {
      display: block;
      background: #1e293b;
      padding: 0.5rem 1rem;
      margin: 0.3rem 0;
      border-radius: 4px;
      color: #a5f3fc;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1><%= title %></h1>
    <p><%= description %></p>
    <div class="status">
      Server Status: <span>Running</span>
    </div>
    <div class="endpoints">
      <h3>API Endpoints</h3>
      <code>GET /api — Home endpoint</code>
    </div>
  </div>
</body>
</html>
```

---

## Upload (S3)

### `src/services/upload.service.js`

```javascript
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import path from 'path';
import s3Client from '../config/s3.js';

/**
 * Upload a file to S3 using @aws-sdk/lib-storage (stream-based, auto multipart)
 * @param {Object} file - multer file object (buffer, mimetype, originalname)
 * @param {number} productId - product ID for folder structure
 * @returns {string} S3 key (filename stored in DB)
 */
export const uploadToS3 = async (file, productId) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const key = `${process.env.AWS_S3_PREFIX}/products/${productId}/${Date.now()}${ext}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        },
        // Auto multipart: splits into 5MB chunks for large files
        queueSize: 4,          // concurrent upload parts
        partSize: 5 * 1024 * 1024,  // 5MB per part
    });

    await upload.done();
    return key;
};

/**
 * Delete a file from S3
 * @param {string} key - S3 key to delete
 */
export const deleteFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    });

    await s3Client.send(command);
};
```

### `src/middlewares/upload.js`

```javascript
import multer from 'multer';
import AppError from '../utils/AppError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only jpg, png, and webp images are allowed', 422), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
```

---

## Routes Index

### `src/routes/index.js`

```javascript
import { Router } from 'express';
import { getHome } from '../controllers/home.controller.js';
import authRoutes from './auth.routes.js';
import mfaRoutes from './mfa.routes.js';
import adminRoutes from './admin.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

router.get('/', getHome);

// Auth routes
router.use('/auth', authRoutes);
router.use('/auth', mfaRoutes);

// Admin routes
router.use('/admin', adminRoutes);

//Product routes
router.use('/products', productRoutes);

// Order routes
router.use('/orders', orderRoutes);

export default router;
```

### `src/routes/web.routes.js`

```javascript
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Node Express App',
    description: 'A Node.js + Express API server',
  });
});

export default router;
```

### `src/controllers/home.controller.js`

```javascript
import redisClient from '../config/redis.js';

export const getHome = async (req, res) => {
  const currentVisits = Number(await redisClient.get('visits') || 0) + 1;
  await redisClient.set('visits', currentVisits);
  res.json({ message: 'Hello World!', visits: currentVisits });
};
```

---

## License

ISC
