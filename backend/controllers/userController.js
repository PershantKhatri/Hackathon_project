const User = require('../models/User');

// @desc Get all registered users (Admin)
// @route GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user status (Approve, Reject, Activate, Deactivate)
// @route PATCH /api/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'ACTIVE', 'REJECTED', 'DEACTIVATED', 'PENDING'
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status || user.status;
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      message: `User status successfully updated to ${updatedUser.status}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user role (USER / ADMIN)
// @route PATCH /api/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body; // 'USER' or 'ADMIN'
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role || user.role;
    const updatedUser = await user.save();
    
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      message: `User role successfully updated to ${updatedUser.role}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUserStatus, updateUserRole };