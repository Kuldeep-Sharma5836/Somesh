const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const { categories, products } = require('./src/data/seedData');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
    ]);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dhruvglobaltradingcompany.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

    const [adminUser] = await User.create([
      {
        name: 'Dhruv Global Trading Company Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      },
      {
        name: 'Sample Devotee',
        email: 'devotee@dhruvglobaltradingcompany.com',
        password: 'User@123',
        role: 'user',
      },
    ]);

    const createdCategories = await Category.insertMany(categories);

    const categoryMap = createdCategories.reduce((acc, item) => {
      acc[item.slug] = item._id;
      return acc;
    }, {});

    const productPayload = products.map((item) => ({
      ...item,
      slug: `${item.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${Date.now()}`,
      category: categoryMap[item.categorySlug],
      categorySlug: undefined,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      numReviews: Math.floor(Math.random() * 80 + 10),
      reviews: [],
    }));

    await Product.insertMany(productPayload);

    console.log('Seed data inserted successfully');
    console.log(`Admin login => ${adminEmail} / ${adminPassword}`);
    mongoose.connection.close();
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

seed();
