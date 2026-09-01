const express = require('express');
const router = express.Router();
const { 
  createComplaint, 
  getMyComplaints, 
  getAllComplaints, 
  updateComplaintStatus 
} = require('../controllers/complaintController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User Routes
router.post('/', protect, createComplaint);
router.get('/my-complaints', protect, getMyComplaints);

// Admin Routes
router.get('/all', protect, adminOnly, getAllComplaints);
router.patch('/:id/status', protect, adminOnly, updateComplaintStatus);

module.exports = router;