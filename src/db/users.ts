
// This file simulates a simple database for user authentication
// In a real application, this would be a database like SQL or NoSQL

import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, this would be hashed
}

// In-memory user database
let users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'password123'
  }
];

// Save to localStorage to persist data
const saveUsers = () => {
  try {
    localStorage.setItem('users_db', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

// Load from localStorage on startup
const loadUsers = () => {
  try {
    const savedUsers = localStorage.getItem('users_db');
    if (savedUsers) {
      users = JSON.parse(savedUsers);
    }
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
  }
};

// Initialize by loading saved users
loadUsers();

// Register a new user
export const registerUser = (email: string, name: string, password: string): User | null => {
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    toast.error('User with this email already exists');
    return null;
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password // In a real app, this would be hashed
  };

  users.push(newUser);
  saveUsers();
  
  // Return user without password for security
  const { password: _, ...safeUser } = newUser;
  return safeUser as User;
};

// Login a user
export const loginUser = (email: string, password: string): User | null => {
  const user = users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    toast.error('Invalid email or password');
    return null;
  }
  
  // Return user without password for security
  const { password: _, ...safeUser } = user;
  return safeUser as User;
};

// Get all users (for admin purposes)
export const getAllUsers = (): Omit<User, 'password'>[] => {
  return users.map(({ password, ...user }) => user);
};

// Log database operations for debugging
export const logDatabaseOperation = (operation: string, details: string) => {
  console.log(`[Database] ${operation}: ${details}`);
};
