import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types';
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{children:any}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('eh_token');
    const userStr = localStorage.getItem('eh_user');
    if (token && userStr) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(JSON.parse(userStr));
    }
  }, []);

  const login = async (email:string, password:string) => {
    const res = await axios.post(`${API}/api/auth/login`, { email, password });
    const { token, user } = res.data;
    localStorage.setItem('eh_token', token);
    localStorage.setItem('eh_user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const signup = async (payload:any) => {
    const res = await axios.post(`${API}/api/auth/signup`, payload);
    const { token, user } = res.data;
    localStorage.setItem('eh_token', token);
    localStorage.setItem('eh_user', JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('eh_token'); localStorage.removeItem('eh_user');
    delete axios.defaults.headers.common['Authorization']; setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
