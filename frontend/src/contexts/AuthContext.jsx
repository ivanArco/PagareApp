/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        axios.defaults.headers.common['x-auth-token'] = token;
        const res = await axios.get('http://localhost:5000/api/auth/me');
        if (mounted) setUser(res.data);
      } catch {
        logout();
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadUser();
    return () => { mounted = false; };
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('http://localhost:5000/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };


  const value = { user, token, login, register, logout, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};