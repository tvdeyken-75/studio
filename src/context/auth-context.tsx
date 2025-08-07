"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_USER: User = { 
  id: 'admin-user', 
  email: 'admin@ambienttms.com', 
  name: 'Admin User', 
  password: 'password',
  role: 'Admin'
};

const USERS_STORAGE_KEY = 'ambientTmsUsers';
const LOGGED_IN_USER_STORAGE_KEY = 'ambientTmsUser';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load users list from localStorage or initialize with admin
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers([ADMIN_USER]);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([ADMIN_USER]));
      }

      // Check for a logged-in user
      const storedUser = localStorage.getItem(LOGGED_IN_USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      localStorage.removeItem(USERS_STORAGE_KEY);
      localStorage.removeItem(LOGGED_IN_USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    const storedUsersJSON = localStorage.getItem(USERS_STORAGE_KEY);
    const storedUsers: User[] = storedUsersJSON ? JSON.parse(storedUsersJSON) : [ADMIN_USER];

    const foundUser = storedUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );
    
    if (foundUser) {
      const { password, ...userToStore } = foundUser;
      localStorage.setItem(LOGGED_IN_USER_STORAGE_KEY, JSON.stringify(userToStore));
      setUser(userToStore);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = () => {
    localStorage.removeItem(LOGGED_IN_USER_STORAGE_KEY);
    setUser(null);
  };
  
  const persistUsers = (updatedUsers: User[]) => {
      setUsers(updatedUsers);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  }

  const addUser = (newUser: User) => {
    persistUsers([...users, newUser]);
  }
  
  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    persistUsers(updatedUsers);
  }

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    persistUsers(updatedUsers);
  }


  return (
    <AuthContext.Provider value={{ user, users, login, logout, loading, addUser, updateUser, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
