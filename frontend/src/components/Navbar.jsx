import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHospital, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaUserPlus, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-lg sticky-top" 
         style={{ 
           // CHANGED: From Black to Deep Royal Blue Gradient
           background: 'linear-gradient(90deg, #002244 0%, #0055aa 100%)', 
           padding: '0.8rem 0',
           zIndex: 1050 
         }}>
      <div className="container">
        
        {/* 1. BRAND LOGO */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="bg-white text-primary rounded p-1 d-flex align-items-center justify-content-center shadow-sm" style={{width: '35px', height: '35px'}}>
            <FaHospital size={20} /> 
          </div>
          <span className="fw-bold fs-5" style={{letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>TestInsure</span>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 2. NAVIGATION */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            
            {user ? (
              <>
                {/* Notification Bell */}
                <li className="nav-item me-2 d-none d-lg-block">
                  <button className="btn btn-link text-white-50 position-relative p-0 hover-white" title="Notifications">
                    <FaBell size={20} />
                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                      <span className="visually-hidden">New alerts</span>
                    </span>
                  </button>
                </li>

                {/* Vertical Divider */}
                <li className="d-none d-lg-block border-end border-white border-opacity-25 mx-1" style={{height: '30px'}}></li>

                {/* User Info & Logout Wrapper */}
                <li className="nav-item d-flex align-items-center gap-3">
                  
                  {/* User Profile Glass Capsule */}
                  <div className="d-flex align-items-center text-end">
                    <div className="d-flex flex-column me-2" style={{lineHeight: '1.1'}}>
                      <span className="fw-bold text-white small">{user.name}</span>
                      <span className="text-info small text-uppercase fw-bold" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>{user.role}</span>
                    </div>
                    <div className="position-relative">
                      <FaUserCircle className="text-white opacity-75" size={32} />
                      <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1" style={{width: '10px', height: '10px'}}></span>
                    </div>
                  </div>

                  {/* CHANGED: Logout Button with Text */}
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-sm btn-danger rounded-pill d-flex align-items-center fw-bold px-3 py-1 shadow-sm"
                    style={{fontSize: '0.85rem'}}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>

                </li>
              </>
            ) : (
              // Guest State
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white opacity-75 hover-opacity-100 d-flex align-items-center gap-2 font-monospace">
                    <FaSignInAlt /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-light text-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
                    <FaUserPlus /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;