import { createContext, useState, useEffect } from 'react';

// Create the storage box
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores: { name, role, token }
  const [loading, setLoading] = useState(true);

  // 1. Load User on Page Refresh
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedName = localStorage.getItem('name');

    if (savedToken) {
      setUser({ token: savedToken, role: savedRole, name: savedName });
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = (data) => {
    // Save to Browser (so it persists after refresh)
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name);
    
    // Save to State (for React to use instantly)
    setUser({ token: data.token, role: data.role, name: data.name });
  };

  // 3. Logout Function
  const logout = () => {
    localStorage.clear(); // Wipe the hard drive
    setUser(null); // Wipe the state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};