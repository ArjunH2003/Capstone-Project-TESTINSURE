import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter/Router
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- 1. IMPORT THEME PROVIDER ONLY ---
// (AuthProvider is already in main.jsx, so we don't need it here)
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminTests from './pages/AdminTests';
import AdminSlots from './pages/AdminSlots';
import AdminClaims from './pages/AdminClaims';
import AdminReports from './pages/AdminReports';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import BookTest from './pages/BookTest';

// Security Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // --- 2. WRAP ONLY THEME PROVIDER ---
    <ThemeProvider> 
      
      {/* Global Popup Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Note: No <Router> here because it is in main.jsx */}
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- ADMIN ROUTES (Protected) --- */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRole="ADMIN"> <AdminDashboard /> </ProtectedRoute>
        } />
        <Route path="/admin/tests" element={
          <ProtectedRoute allowedRole="ADMIN"> <AdminTests /> </ProtectedRoute>
        } />
        <Route path="/admin/slots" element={
          <ProtectedRoute allowedRole="ADMIN"> <AdminSlots /> </ProtectedRoute>
        } />
        <Route path="/admin/claims" element={
          <ProtectedRoute allowedRole="ADMIN"> <AdminClaims /> </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRole="ADMIN"> <AdminReports /> </ProtectedRoute>
        } />

        {/* --- PATIENT ROUTES (Protected) --- */}
        <Route path="/patient-dashboard" element={
          <ProtectedRoute allowedRole="PATIENT"> <PatientDashboard /> </ProtectedRoute>
        } />
        <Route path="/book-test" element={
          <ProtectedRoute allowedRole="PATIENT"> <BookTest /> </ProtectedRoute>
        } />
      </Routes>

    </ThemeProvider>
  );
}

export default App;