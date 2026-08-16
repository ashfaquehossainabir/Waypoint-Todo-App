const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser,
  setUserStatus,
  resetUserPassword,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.patch('/users/:id/status', setUserStatus);
router.put('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUser);

module.exports = router;
