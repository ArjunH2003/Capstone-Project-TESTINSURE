import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <>
      {/* Global Popup Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Routes>
        {/* --- PUBLIC ROUTES (Open to everyone) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- ADMIN ROUTES (Protected: Only 'ADMIN' role allowed) --- */}
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

        {/* --- PATIENT ROUTES (Protected: Only 'PATIENT' role allowed) --- */}
        <Route path="/patient-dashboard" element={
          <ProtectedRoute allowedRole="PATIENT"> <PatientDashboard /> </ProtectedRoute>
        } />
        <Route path="/book-test" element={
          <ProtectedRoute allowedRole="PATIENT"> <BookTest /> </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App;