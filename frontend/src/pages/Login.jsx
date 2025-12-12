import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaArrowLeft, FaHospital } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      toast.success("Welcome back!");
      if (response.data.role === 'ADMIN') navigate('/admin-dashboard');
      else navigate('/patient-dashboard');
    } catch (error) {
      toast.error("Invalid Credentials.");
    }
  };

  return (
    <div className="min-vh-100 d-flex bg-white">
      <ToastContainer />
      
      {/* LEFT SIDE: BRANDING (Dark & Professional) */}
      <div className="d-none d-lg-flex col-lg-6 flex-column justify-content-center align-items-center text-white p-5" 
           style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
        <div className="text-center" style={{maxWidth: '500px'}}>
          <div className="mb-4 p-3 bg-white bg-opacity-10 rounded-circle d-inline-block">
            <FaHospital size={60} />
          </div>
          <h1 className="fw-bold display-5 mb-3">TestInsure Portal</h1>
          <p className="lead opacity-75">
            Secure access to diagnostic records, insurance claims, and hospital management services.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: FORM (Clean & Sharp) */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-5">
        <div className="w-100" style={{maxWidth: '420px'}}>
          
          <Link to="/" className="text-decoration-none text-muted fw-bold small mb-5 d-inline-flex align-items-center hover-link">
            <FaArrowLeft className="me-2" /> Back to Home
          </Link>

          <div className="mb-4 mt-3">
            <h2 className="fw-bold text-dark mb-1">Sign In</h2>
            <p className="text-muted">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold text-uppercase small text-muted" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3"><FaEnvelope /></span>
                <input 
                  type="email" 
                  className="form-control border-start-0 ps-2 py-2" 
                  placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold text-uppercase small text-muted" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted ps-3"><FaLock /></span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-2 py-2" 
                  placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
              Sign In
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">New Patient? </span>
            <Link to="/register" className="fw-bold text-primary text-decoration-none">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;