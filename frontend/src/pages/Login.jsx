import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaHospital, FaArrowRight, FaUserPlus, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      if (response.data.role === 'ADMIN') navigate('/admin-dashboard');
      else navigate('/patient-dashboard');
    } catch (error) {
      toast.error("Invalid Credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="vivid-wrapper">
      <ToastContainer position="top-right" theme="colored" />

      {/* --- VIVID BACKGROUND ANIMATION --- */}
      <div className="grid-floor"></div>
      
      {/* These orbs are now much darker/richer to be visible */}
      <div className="vivid-orb orb-1"></div>
      <div className="vivid-orb orb-2"></div>
      <div className="vivid-orb orb-3"></div>

      {/* --- CRYSTAL LENS CARD --- */}
      <div className="lens-card slide-up-fade">
        
        {/* Top Reflective Edge */}
        <div className="lens-shine"></div>

        {/* Header */}
        <div className="text-center mb-5 position-relative z-2">
          <div className="logo-jewel mb-4 mx-auto shadow-lg">
            <FaHospital size={32} className="text-white" />
          </div>
          <h1 className="fw-bolder text-dark mb-1 tracking-tight" style={{ fontSize: '2.2rem' }}>TestInsure</h1>
          <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div className="input-group-lens mb-4">
            <label className="lens-label">Email Address</label>
            <div className="lens-field">
              <div className="lens-icon">
                <FaEnvelope />
              </div>
              <input 
                type="email" 
                className="lens-input" 
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group-lens mb-5">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="lens-label mb-0">Password</label>
                <a href="#" className="lens-link">Forgot?</a>
            </div>
            <div className="lens-field">
              <div className="lens-icon">
                <FaLock />
              </div>
              <input 
                type="password" 
                className="lens-input" 
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Action Button */}
          <button 
            type="submit" 
            className={`btn-royal w-100 ${loading ? 'processing' : ''}`}
            disabled={loading}
          >
            <span className="btn-content">
                {loading ? 'AUTHENTICATING...' : 'SIGN IN'} 
                {!loading && <FaArrowRight className="ms-2" />}
            </span>
            <div className="btn-glare"></div>
          </button>

        </form>

        {/* Footer */}
        <div className="text-center mt-5 pt-4 border-top border-dark border-opacity-10">
          <p className="text-muted small mb-3 fw-bold">No account?</p>
          <Link to="/register" className="register-pill">
            <FaUserPlus className="me-2" /> Create an Account
          </Link>
        </div>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        /* 1. LAYOUT & GRID */
        .vivid-wrapper {
          min-height: 100vh; width: 100%;
          display: flex; align-items: center; justify-content: center;
          background-color: #f8fafc; /* Slate-50 Base */
          position: relative; overflow: hidden; font-family: 'Inter', sans-serif;
        }

        /* Perspective Grid for Depth */
        .grid-floor {
          position: absolute; width: 200%; height: 100%; bottom: -20%; left: -50%;
          background-image: 
            linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px);
          background-size: 80px 80px;
          transform: perspective(1000px) rotateX(60deg);
          z-index: 0; pointer-events: none;
        }

        /* 2. HIGH VISIBILITY ORBS (Saturated Colors) */
        .vivid-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.65;
          z-index: 0; animation: floatVivid 10s infinite ease-in-out alternate;
        }
        
        /* Orb 1: Deep Royal Blue */
        .orb-1 {
          width: 500px; height: 500px;
          background: #3b82f6; /* Blue-500 */
          top: -15%; left: -10%;
        }
        /* Orb 2: Vibrant Cyan */
        .orb-2 {
          width: 450px; height: 450px;
          background: #06b6d4; /* Cyan-500 */
          bottom: -10%; right: -5%;
          animation-delay: -3s; animation-duration: 12s;
        }
        /* Orb 3: Electric Indigo */
        .orb-3 {
          width: 350px; height: 350px;
          background: #6366f1; /* Indigo-500 */
          top: 40%; left: 35%;
          animation-delay: -6s; opacity: 0.5;
        }

        @keyframes floatVivid {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(40px, 60px) scale(1.1); }
        }

        /* 3. LENS CARD (More Transparent to show colors) */
        .lens-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          padding: 3.5rem 3rem;
          
          /* The Lens Effect */
          background: rgba(255, 255, 255, 0.75); /* Lower opacity = More background visibility */
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          
          /* Strong Shadow for Pop */
          box-shadow: 
            0 40px 80px -20px rgba(37, 99, 235, 0.3), 
            0 0 0 1px rgba(255, 255, 255, 0.8) inset;
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .lens-shine {
          position: absolute; top: 0; left: 20%; width: 60%; height: 2px;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          opacity: 0.8;
        }

        /* 4. BRANDING */
        .logo-jewel {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 20px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 12px 25px -5px rgba(37, 99, 235, 0.5);
          transform: rotate(-5deg); transition: transform 0.4s;
        }
        .lens-card:hover .logo-jewel { transform: rotate(0deg) scale(1.05); }

        .badge-capsule {
          font-size: 0.65rem; font-weight: 800; letter-spacing: 1px; color: #1e40af;
          background: rgba(219, 234, 254, 0.8); padding: 4px 10px; border-radius: 20px;
        }

        .tracking-tight { letter-spacing: -1px; }

        /* 5. INPUTS (High Contrast) */
        .lens-label {
          font-size: 0.75rem; font-weight: 800; color: #1e3a8a; /* Deep Navy */
          text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 0.5rem; display: block;
        }

        .lens-field {
          display: flex; align-items: center; position: relative;
          background: #fff; border: 2px solid #e2e8f0;
          border-radius: 14px; overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .lens-field:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
          transform: translateY(-1px);
        }

        .lens-icon {
          padding: 0 0 0 16px; color: #94a3b8; font-size: 1.1rem;
          display: flex; align-items: center; justify-content: center;
        }
        .lens-field:focus-within .lens-icon { color: #2563eb; }

        .lens-input {
          width: 100%; padding: 14px 16px 14px 12px;
          border: none; background: transparent;
          font-size: 1rem; color: #0f172a; font-weight: 600; outline: none;
        }
        .lens-input::placeholder { color: #94a3b8; }

        /* 6. BUTTON (Royal Blue Gradient) */
        .btn-royal {
          position: relative; width: 100%; padding: 16px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
          color: white; font-weight: 800; font-size: 1rem; letter-spacing: 1px;
          cursor: pointer; overflow: hidden;
          box-shadow: 0 10px 20px -5px rgba(29, 78, 216, 0.4);
          transition: all 0.3s ease;
        }
        .btn-royal:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(29, 78, 216, 0.5); }
        .btn-royal:active { transform: translateY(0); }
        
        .btn-glare {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg); animation: glareMove 3s infinite; pointer-events: none;
        }
        @keyframes glareMove { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }

        /* 7. LINKS */
        .lens-link { font-size: 0.85rem; color: #2563eb; text-decoration: none; font-weight: 700; transition: color 0.2s; }
        .lens-link:hover { color: #1e3a8a; }

        .register-pill {
          display: inline-flex; align-items: center; padding: 12px 28px;
          background: #fff; border: 1px solid #e2e8f0; border-radius: 50px;
          color: #1e40af; font-weight: 800; font-size: 0.9rem;
          text-decoration: none; transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .register-pill:hover {
          background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8;
          transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.15);
        }

        /* 8. ANIMATION */
        .slide-up-fade { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(40px); }
        @keyframes slideUpFade { to { opacity: 1; transform: translateY(0); } }
        
        .processing { opacity: 0.75; cursor: wait; }
      `}</style>
    </div>
  );
};

export default Login;