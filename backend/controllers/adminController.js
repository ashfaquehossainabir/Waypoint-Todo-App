const User = require('../models/User');
const Task = require('../models/Task');
const Category = require('../models/Category');

// @route GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    const taskCounts = await Task.aggregate([
      {
        $group: {
          _id: '$user',
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
        },
      },
    ]);
    const categoryCounts = await Category.aggregate([
      { $group: { _id: '$user', total: { $sum: 1 } } },
    ]);

    const taskMap = {};
    taskCounts.forEach((t) => {
      taskMap[t._id.toString()] = { total: t.total, completed: t.completed };
    });
    const catMap = {};
    categoryCounts.forEach((c) => {
      catMap[c._id.toString()] = c.total;
    });

    const withStats = users.map((u) => ({
      ...u.toSafeObject(),
      taskCount: taskMap[u._id.toString()]?.total || 0,
      completedTaskCount: taskMap[u._id.toString()]?.completed || 0,
      categoryCount: catMap[u._id.toString()] || 0,
    }));

    res.json({ users: withStats });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ message: 'Name cannot be empty' });
      user.name = name.trim();
    }

    if (email !== undefined) {
      if (!email.trim()) return res.status(400).json({ message: 'Email cannot be empty' });
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }
      user.email = normalizedEmail;
    }

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Role must be either "user" or "admin"' });
      }
      if (user._id.equals(req.user._id) && role !== 'admin') {
        return res.status(400).json({ message: 'You cannot remove your own admin role' });
      }
      user.role = role;
    }

    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route PATCH /api/admin/users/:id/status
const setUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be true or false' });
    }

    if (req.params.id === req.user._id.toString() && !isActive) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isActive = isActive;
    await user.save();

    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/admin/users/:id/reset-password
const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: `Password reset for ${user.name}` });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account from here' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Promise.all([
      Task.deleteMany({ user: user._id }),
      Category.deleteMany({ user: user._id }),
    ]);
    await user.deleteOne();

    res.json({ message: 'User deleted', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUser, deleteUser, setUserStatus, resetUserPassword };
