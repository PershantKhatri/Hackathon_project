import { useState, useEffect } from 'react';
import API from '../../services/api';
import Navbar from '../../components/Navbar/Navbar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('complaints');

  const fetchAdminData = async () => {
    try {
      const compRes = await API.get('/complaints/all'); // Fixed URL
      setComplaints(compRes.data);

      const userRes = await API.get('/users'); // Fixed URL
      setUsers(userRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/complaints/${id}/status`, { status: newStatus }); // Fixed URL
      fetchAdminData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleUserStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/users/${id}/status`, { status }); // Fixed URL
      fetchAdminData();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h2>Admin Management Dashboard</h2>

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
            <h3>Registered Users & Approval</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <span className={`status-badge ${u.status.toLowerCase()}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {u.status === 'PENDING' ? (
                        <button 
                          onClick={() => handleUserStatusUpdate(u._id, 'ACTIVE')} 
                          className="approve-btn"
                        >
                          Approve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUserStatusUpdate(u._id, u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                          className={u.status === 'ACTIVE' ? 'deactivate-btn' : 'approve-btn'}
                        >
                          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
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