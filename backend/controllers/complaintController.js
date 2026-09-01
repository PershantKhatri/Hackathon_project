const Complaint = require('../models/Complaint');

// 1. Create a new complaint (User)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get logged-in user's complaints (User Dashboard)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get all complaints (Admin Dashboard)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update complaint status (Admin: Review, In Progress, Resolved, Rejected)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status || complaint.status;
    const updatedComplaint = await complaint.save();

    res.json({
      message: 'Complaint status updated successfully',
      complaint: updatedComplaint
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus
};