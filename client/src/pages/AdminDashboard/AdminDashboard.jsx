import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit User State
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '', status: '' });

  const fetchAdminData = async () => {
    try {
      setError('');
      const compRes = await API.get('/complaints/all');
      setComplaints(compRes.data);

      const userRes = await API.get('/users');
      setUsers(userRes.data);
    } catch (err) {
      setError('Error fetching admin data');
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/complaints/${id}/status`, { status: newStatus });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUserStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/users/${id}/status`, { status });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  // Start Editing User
  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditFormData({ 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status 
    });
  };

  // Handle Edit Input Changes
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Submit Updated User Details
  const handleUpdateUser = async (userId) => {
    try {
      await API.put(`/users/${userId}`, editFormData);
      setEditingUserId(null);
      setSuccess('User updated successfully');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user account?')) return;

    try {
      await API.delete(`/users/${userId}`);
      setSuccess('User deleted successfully');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Admin Management Dashboard</h2>

        {error && <div className="error-msg" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div className="success-msg" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}

        {/* Tab Switching Buttons */}
        <div className="tab-buttons">
          <button 
            className={activeTab === 'complaints' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setActiveTab('complaints')}
          >
            Manage Complaints ({complaints.length})
          </button>
          <button 
            className={activeTab === 'users' ? 'tab-btn active' : 'tab-btn'} 
            onClick={() => setActiveTab('users')}
          >
            Manage Users ({users.length})
          </button>
        </div>

        {/* Complaints Tab */}
        {activeTab === 'complaints' && (
          <div className="table-card">
            <h3>All System Complaints</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.user?.name || 'N/A'}</td>
                    <td>{c.title}</td>
                    <td>{c.category}</td>
                    <td>{c.priority}</td>
                    <td>
                      <span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        value={c.status} 
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Admin Review">Admin Review</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="table-card">
            <h3>Registered Users & Administration</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    {editingUserId === u._id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            name="name" 
                            value={editFormData.name} 
                            onChange={handleEditChange} 
                          />
                        </td>
                        <td>
                          <input 
                            type="email" 
                            name="email" 
                            value={editFormData.email} 
                            onChange={handleEditChange} 
                          />
                        </td>
                        <td>
                          <select name="role" value={editFormData.role} onChange={handleEditChange}>
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td>
                          <select name="status" value={editFormData.status} onChange={handleEditChange}>
                            <option value="PENDING">PENDING</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="DEACTIVATED">DEACTIVATED</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => handleUpdateUser(u._id)} className="approve-btn">Save</button>
                          <button onClick={() => setEditingUserId(null)} className="deactivate-btn" style={{ marginLeft: '4px' }}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>
                          <span className={`status-badge ${u.status.toLowerCase()}`}>
                            {u.status}
                          </span>
                        </td>
                        <td>
                          {u.status === 'PENDING' && (
                            <button 
                              onClick={() => handleUserStatusUpdate(u._id, 'ACTIVE')} 
                              className="approve-btn"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditClick(u)} 
                            className="tab-btn edit-action-btn"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)} 
                            className="deactivate-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}