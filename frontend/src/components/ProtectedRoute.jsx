import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component wraps the page we want to protect
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. Wait for Auth to load (prevents kicking user out on refresh)
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // 2. Not Logged In? -> Go to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Wrong Role? -> Go to Home (or their own dashboard)
  if (allowedRole && user.role !== allowedRole) {
    // If Admin tries to access Patient page -> Admin Dashboard
    if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;
    
    // If Patient tries to access Admin page -> Patient Dashboard
    if (user.role === 'PATIENT') return <Navigate to="/patient-dashboard" replace />;
    
    return <Navigate to="/" replace />;
  }

  // 4. Access Granted -> Render the Page
  return children;
};

export default ProtectedRoute;