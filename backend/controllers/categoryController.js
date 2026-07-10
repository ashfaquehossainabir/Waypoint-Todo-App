const Category = require('../models/Category');
const Task = require('../models/Task');

// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });

    // include task counts per category
    const counts = await Task.aggregate([
      { $match: { user: req.user._id, category: { $ne: null } } },
      { $group: { _id: '$category', total: { $sum: 1 }, completed: { $sum: { $cond: ['$completed', 1, 0] } } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = { total: c.total, completed: c.completed };
    });

    const withCounts = categories.map((c) => ({
      ...c.toObject(),
      taskCount: countMap[c._id.toString()]?.total || 0,
      completedCount: countMap[c._id.toString()]?.completed || 0,
    }));

    res.json({ categories: withCounts });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      color: color || '#0E7C6F',
    });

    res.status(201).json({ category });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const { name, color } = req.body;
    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Category name cannot be empty' });
      category.name = name.trim();
    }
    if (color !== undefined) category.color = color;

    await category.save();
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Unlink this category from any tasks that used it
    await Task.updateMany(
      { user: req.user._id, category: category._id },
      { $set: { category: null } }
    );

    res.json({ message: 'Category deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
