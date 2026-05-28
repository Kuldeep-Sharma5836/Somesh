const Product = require('../models/Product');

const SIZE_ORDER = ['S', 'M', 'L'];

const splitStockAcrossSizes = (total) => {
  const base = Math.floor(total / SIZE_ORDER.length);
  const remainder = total % SIZE_ORDER.length;
  return SIZE_ORDER.map((size, index) => ({
    size,
    qty: base + (index < remainder ? 1 : 0),
  }));
};

const normalizeSizes = (sizes = [], countInStock = 0) => {
  if (!Array.isArray(sizes) || sizes.length === 0) {
    return splitStockAcrossSizes(Number(countInStock) || 0);
  }

  const sizeMap = new Map();
  sizes.forEach((entry) => {
    if (!entry || !entry.size) return;
    const key = String(entry.size).toUpperCase();
    if (!SIZE_ORDER.includes(key)) return;
    sizeMap.set(key, Math.max(0, Number(entry.qty) || 0));
  });

  return SIZE_ORDER.map((size) => ({ size, qty: sizeMap.get(size) || 0 }));
};

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getProducts = async (req, res) => {
  const { search = '', category = '', minPrice = 0, maxPrice = Number.MAX_SAFE_INTEGER } = req.query;

  const query = {
    name: { $regex: search, $options: 'i' },
    price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
  };

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json(products);
};

const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .populate('category', 'name slug')
    .limit(8);

  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json(product);
};

const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    countInStock,
    sizes,
    brand,
    category,
    images = [],
    isFeatured = false,
    tags = [],
  } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: 'Name, description, price, and category are required' });
  }

  const slug = `${slugify(name)}-${Date.now()}`;

  const normalizedSizes = normalizeSizes(sizes, countInStock);
  const computedCount = normalizedSizes.reduce((acc, item) => acc + item.qty, 0);

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    countInStock: computedCount,
    sizes: normalizedSizes,
    brand,
    category,
    images,
    isFeatured,
    tags,
  });

  const created = await product.populate('category', 'name slug');
  res.status(201).json(created);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const fields = [
    'name',
    'description',
    'price',
    'countInStock',
    'sizes',
    'brand',
    'category',
    'images',
    'isFeatured',
    'tags',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  if (req.body.sizes !== undefined) {
    const normalizedSizes = normalizeSizes(req.body.sizes, req.body.countInStock);
    product.sizes = normalizedSizes;
    product.countInStock = normalizedSizes.reduce((acc, item) => acc + item.qty, 0);
  }

  if (req.body.name) {
    product.slug = `${slugify(req.body.name)}-${Date.now()}`;
  }

  const updated = await product.save();
  const populated = await updated.populate('category', 'name slug');
  res.json(populated);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  await product.deleteOne();
  res.json({ message: 'Product removed' });
};

const addProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingReview = product.reviews?.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    return res.status(400).json({ message: 'You already reviewed this product' });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  if (!product.reviews) {
    product.reviews = [];
  }

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
};
