import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
