const express = require('express');
const { 
  getAllUsers, 
  updateUserStatus, 
  updateUserRole 
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Sabhi routes ke liye Admin hona aur logged-in hona zaroori hai
router.use(protect, adminOnly);

router.route('/').get(getAllUsers);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/role', updateUserRole);

module.exports = router;