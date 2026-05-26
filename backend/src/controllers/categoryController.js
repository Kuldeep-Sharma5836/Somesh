const Category = require('../models/Category');

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { name, description, image } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const slug = slugify(name);
  const exists = await Category.findOne({ slug });
  if (exists) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = await Category.create({ name, slug, description, image });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { name, description, image } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }

  category.description = description ?? category.description;
  category.image = image ?? category.image;

  const updated = await category.save();
  res.json(updated);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  await category.deleteOne();
  res.json({ message: 'Category removed' });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
