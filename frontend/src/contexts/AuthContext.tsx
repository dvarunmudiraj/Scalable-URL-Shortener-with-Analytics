import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiCall } from '../lib/api';

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  approved: boolean; // match backend field
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.token || !response.user) {
      throw new Error('Invalid response from server');
    }

    setToken(response.token);
    // Ensure user.approved is set correctly (backend sends 'approved')
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
  } catch (error: any) {
    console.error('Login failed:', error);
    throw new Error(error.message || 'Login failed');
  }
};


  const signup = async (email: string, username: string, password: string) => {
  try {
    const response = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("Signup API response:", response); // ✅ Add this

    if (response.message?.includes('successfully')) {
      alert(response.message);
    } else {
      throw new Error(response.message || 'Signup failed.');
    }
  } catch (error: any) {
    console.error('Signup failed (frontend):', error);
    throw new Error(error.message || 'Signup failed');
  }
};

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
