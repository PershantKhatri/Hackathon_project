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
    const { status } = req.body; 
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
    const targetUser = await User.findById(req.params.id);
    const loggedInAdmin = req.user; // Request bhejne wala admin (Auth middleware se aayega)

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Admin apne aap ko USER nahi bana sakta
    if (loggedInAdmin._id.toString() === targetUser._id.toString() && role === 'USER') {
      return res.status(400).json({ message: 'Aap apne aap ko ADMIN se remove nahi kar sakte!' });
    }

    // 2. Agar loggedInAdmin ko is targetUser ne banaya tha (yani junior admin senior ko remove karne ki koshish kar raha hai)
    if (targetUser.createdBy && targetUser.createdBy.toString() === loggedInAdmin._id.toString()) {
      // Junior admin apne creator ko downgrade nahi kar sakta
      return res.status(403).json({ message: 'Aap jis admin ne aapko banaya hai, aap usay remove nahi kar sakte!' });
    }

    // Agar ADMIN kisi ko ADMIN bana raha hai toh uska 'createdBy' track karo
    if (role === 'ADMIN' && targetUser.role === 'USER') {
      targetUser.createdBy = loggedInAdmin._id;
    }

    targetUser.role = role || targetUser.role;
    const updatedUser = await targetUser.save();
    
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

// @desc Edit user details by Admin (Handles Role & Status updates from table)
// @route PUT /api/users/:id
const updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const targetUser = await User.findById(req.params.id);
    const loggedInAdmin = req.user;

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Admin apne aap ko USER nahi bana sakta
    if (loggedInAdmin._id.toString() === targetUser._id.toString() && role && role !== 'ADMIN') {
      return res.status(400).json({ message: 'You cannot remove your ownn self from admin!' });
    }

    // 2. Check if a junior admin is trying to modify their creator/senior admin
    if (targetUser._id.toString() !== loggedInAdmin._id.toString()) {
      // Agar target user wo admin hai jisne loggedInAdmin ko banaya tha
      if (loggedInAdmin.createdBy && loggedInAdmin.createdBy.toString() === targetUser._id.toString()) {
        if (role && role === 'USER') {
          return res.status(403).json({ message: 'You cannot remove the admin who created you!' });
        }
      }
    }

    // Agar kisi user ko pehli baar ADMIN banaya ja raha hai toh creator save karo
    if (role === 'ADMIN' && targetUser.role === 'USER') {
      targetUser.createdBy = loggedInAdmin._id;
    }

    targetUser.name = name || targetUser.name;
    targetUser.email = email || targetUser.email;
    targetUser.role = role || targetUser.role;
    targetUser.status = status || targetUser.status;

    const updatedUser = await targetUser.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
      message: 'User updated successfully by admin'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete user by Admin
// @route DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const loggedInAdmin = req.user;

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Admin khud ko delete nahi kar sakta
    if (loggedInAdmin._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete own account!' });
    }

    // 2. Junior admin apne creator/senior admin ko delete nahi kar sakta
    if (targetUser._id.toString() !== loggedInAdmin._id.toString()) {
      if (loggedInAdmin.createdBy && loggedInAdmin.createdBy.toString() === targetUser._id.toString()) {
        return res.status(403).json({ message: 'You cannot delete your creator admin' });
      }
    }

    await targetUser.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAllUsers, 
  updateUserStatus, 
  updateUserRole, 
  updateUserByAdmin, 
  deleteUser 
};