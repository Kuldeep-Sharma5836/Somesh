const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('../src/config/db');
const Product = require('../src/models/Product');

dotenv.config();

const resetSizes = async () => {
  try {
    await connectDB();

    const sizes = [
      { size: 'S', qty: 5 },
      { size: 'M', qty: 5 },
      { size: 'L', qty: 5 },
    ];

    const result = await Product.updateMany(
      {},
      {
        $set: {
          sizes,
          countInStock: sizes.reduce((acc, item) => acc + item.qty, 0),
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} products with size inventory.`);
    mongoose.connection.close();
  } catch (error) {
    console.error(`Reset sizes failed: ${error.message}`);
    mongoose.connection.close();
    process.exit(1);
  }
};

resetSizes();
