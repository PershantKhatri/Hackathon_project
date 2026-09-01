const express = require('express');
const { 
  getAllUsers, 
  updateUserStatus, 
  updateUserRole,
  updateUserByAdmin,
  deleteUser
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Sabhi routes ke liye Admin hona aur logged-in hona zaroori hai
router.use(protect, adminOnly);

router.route('/').get(getAllUsers);
router.patch('/:id/status', updateUserStatus);
router.patch('/:id/role', updateUserRole);

// ⭐ Yeh naye routes add karein admin ke Edit aur Delete ke liye ⭐
router.put('/:id', updateUserByAdmin);   // User details & role update karne ke liye
router.delete('/:id', deleteUser);        // Account delete karne ke liye

module.exports = router;