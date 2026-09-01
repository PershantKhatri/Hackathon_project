import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // <-- Success state added
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const res = await register(name, email, password);
    
    if (res.success) {
      setSuccess('Account created successfully, wait for admin response and give you access.');
      
      // 3 seconds ke baad login page par redirect karein taake user message parh sakay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        
        {/* Error and Success Messages */}
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg" style={{ color: 'green', backgroundColor: '#e6f4ea', padding: '10px', borderRadius: '4px', textAlign: 'center', marginBottom: '15px' }}>{success}</p>}

        <div className="form-group">
          <label>Full Name:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="register-btn">Register</button>
        <p className="switch-text">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}