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
  const [users, setUsers] = useState<User[]>(() => {
    // Initialize with ADMIN_USER to prevent issues on server-side rendering or if localStorage is empty
    return [ADMIN_USER];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsersJSON = localStorage.getItem(USERS_STORAGE_KEY);
      const storedUsers = storedUsersJSON ? JSON.parse(storedUsersJSON) : null;
      
      // Ensure admin user always exists and has admin role
      if (storedUsers) {
        const adminExists = storedUsers.some((u: User) => u.id === ADMIN_USER.id);
        if (!adminExists) {
            const newUsers = [ADMIN_USER, ...storedUsers.filter((u:User) => u.id !== ADMIN_USER.id)];
            setUsers(newUsers);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
        } else {
             const updatedUsers = storedUsers.map((u: User) => u.id === ADMIN_USER.id ? { ...u, role: 'Admin' } : u);
             setUsers(updatedUsers);
             localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        }
      } else {
        setUsers([ADMIN_USER]);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([ADMIN_USER]));
      }
      
      const storedUserJSON = localStorage.getItem(LOGGED_IN_USER_STORAGE_KEY);
      if (storedUserJSON) {
        const loggedInUser = JSON.parse(storedUserJSON);
        // Sync logged-in user's role
        const allUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
        const currentUserData = allUsers.find((u: User) => u.id === loggedInUser.id);
        if (currentUserData) {
            const { password, ...userToStore } = currentUserData;
            setUser(userToStore);
        } else {
             // If logged-in user is not in the list anymore, log them out
             logout();
        }
      }

    } catch (error) {
      console.error("Failed to access or parse localStorage", error);
      // Fallback to default if localStorage is corrupt
      setUsers([ADMIN_USER]);
      setUser(null);
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
    // Prevent deleting the main admin user
    if (userId === ADMIN_USER.id) {
        console.warn("Cannot delete the main admin user.");
        return;
    }
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
