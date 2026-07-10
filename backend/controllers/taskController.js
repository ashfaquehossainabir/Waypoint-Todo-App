const Task = require('../models/Task');
const Category = require('../models/Category');

// @route GET /api/tasks?status=all|pending|completed&category=<id>
const getTasks = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const query = { user: req.user._id };

    if (status === 'pending') query.completed = false;
    if (status === 'completed') query.completed = true;
    if (category) query.category = category;

    const tasks = await Task.find(query).sort({ createdAt: -1 }).populate('category', 'name color');

    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({ user: req.user._id, completed: true });

    res.json({
      tasks,
      stats: {
        total,
        completed,
        pending: total - completed,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).populate(
      'category',
      'name color'
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, category } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let categoryId = null;
    if (category) {
      const owned = await Category.findOne({ _id: category, user: req.user._id });
      if (!owned) return res.status(400).json({ message: 'Invalid category' });
      categoryId = owned._id;
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      category: categoryId,
    });

    await task.populate('category', 'name color');
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, priority, dueDate, category } = req.body;

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: 'Title cannot be empty' });
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    if (category !== undefined) {
      if (category) {
        const owned = await Category.findOne({ _id: category, user: req.user._id });
        if (!owned) return res.status(400).json({ message: 'Invalid category' });
        task.category = owned._id;
      } else {
        task.category = null;
      }
    }

    await task.save();
    await task.populate('category', 'name color');
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/tasks/:id/toggle
const toggleTaskCompletion = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();
    await task.populate('category', 'name color');

    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
};
