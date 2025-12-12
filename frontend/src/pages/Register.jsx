import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data);
      toast.success("Account Created!");
      setTimeout(() => navigate('/patient-dashboard'), 1000);
    } catch (error) {
      toast.error("Registration failed. Email might be in use.");
    }
  };

  return (
    <div className="min-vh-100 d-flex bg-white">
      <ToastContainer />
      
      {/* LEFT SIDE: FORM (High Readability Version) */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-5 order-2 order-lg-1">
        <div className="w-100" style={{maxWidth: '450px'}}>
          
          <Link to="/" className="text-decoration-none text-secondary fw-bold mb-5 d-inline-flex align-items-center hover-link" style={{fontSize: '0.9rem'}}>
            <FaArrowLeft className="me-2" /> Back to Home
          </Link>

          <div className="mb-5 mt-2">
            <h1 className="fw-bold text-dark display-6 mb-2">Create Account</h1>
            <p className="text-secondary fs-6">Start managing your health journey today.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary ps-3"><FaUser /></span>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control bg-light border-start-0 ps-3 py-2 text-dark fw-medium" 
                  placeholder="Enter your name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary ps-3"><FaEnvelope /></span>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control bg-light border-start-0 ps-3 py-2 text-dark fw-medium" 
                  placeholder="Enter your email address" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="form-label fw-bold text-dark small text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary ps-3"><FaPhone /></span>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control bg-light border-start-0 ps-3 py-2 text-dark fw-medium" 
                  placeholder="Enter your phone number" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="form-label fw-bold text-dark small text-uppercase" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary ps-3"><FaLock /></span>
                <input 
                  type="password" 
                  name="password" 
                  className="form-control bg-light border-start-0 ps-3 py-2 text-dark fw-medium" 
                  placeholder="Enter a password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-dark w-100 py-3 fw-bold shadow-lg fs-6 rounded-3">
              Create Account
            </button>
          </form>

          <div className="text-center mt-5">
            <span className="text-secondary">Already have an account? </span>
            <Link to="/login" className="fw-bold text-primary text-decoration-none ms-1">Sign In</Link>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: BRANDING (Dark Elegant - Unchanged) */}
      <div className="d-none d-lg-flex col-lg-6 flex-column justify-content-center align-items-center text-white p-5 order-1 order-lg-2" 
           style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
        <div className="text-center" style={{maxWidth: '500px'}}>
          <div className="mb-4 p-4 bg-white bg-opacity-10 rounded-circle d-inline-block shadow-lg">
            <FaShieldAlt size={70} className="text-success" />
          </div>
          <h1 className="fw-bold display-4 mb-4">Join the Network</h1>
          <p className="lead opacity-75 fs-5">
            Experience seamless insurance integration, instant reporting, and cashless medical services.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;