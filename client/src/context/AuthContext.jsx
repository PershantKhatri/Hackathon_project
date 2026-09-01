import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Register Function
  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data); // Fixed: response.data direct set hoga

      return { 
        success: true, 
        role: response.data.role // Fixed: response.data se role milega
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};