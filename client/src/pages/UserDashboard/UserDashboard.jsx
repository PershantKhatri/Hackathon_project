import { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import './UserDashboard.css';

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT Infrastructure',
    priority: 'Medium'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMyComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/my-complaints'); // Fixed URL
      setComplaints(data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('/complaints', formData); // Fixed URL
      setSuccess('Complaint submitted successfully!');
      setFormData({ title: '', description: '', category: 'IT Infrastructure', priority: 'Medium' });
      fetchMyComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>User Dashboard - Submit & Track Complaints</h2>

        {/* Complaint Submission Form */}
        <div className="form-card">
          <h3>Raise a New Complaint</h3>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3"></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category:</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="IT Infrastructure">IT Infrastructure</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Academics">Academics</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority:</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn">Submit Complaint</button>
          </form>
        </div>

        {/* Complaints History Table */}
        <div className="table-card">
          <h3>My Complaints History</h3>
          {complaints.length === 0 ? (
            <p>No complaints submitted yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.priority}</td>
                    <td><span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}