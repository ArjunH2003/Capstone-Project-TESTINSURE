import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope, FaFileMedical, FaShieldAlt, FaArrowRight, FaUserMd, FaHospital, FaBars } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

// --- HELPER 1: Animated Counter ---
const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } 
      else { setCount(Math.ceil(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
};

// --- HELPER 2: Professional Typewriter ---
const Typewriter = ({ text, delay = 100 }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const cursorTimer = setTimeout(() => setShowCursor(false), 500); 
      return () => clearTimeout(cursorTimer);
    }
  }, [currentIndex, delay, text]);

  return (
    <span>
      {currentText}
      <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.2s' }}>|</span>
    </span>
  );
};

// --- MAIN COMPONENT ---
const Home = () => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [isHeartbeating, setIsHeartbeating] = useState(false);

  const handleStethoscopeClick = () => {
    setIsHeartbeating(true);
    setTimeout(() => setIsHeartbeating(false), 600);
  };

  // 1. DYNAMIC BACKGROUNDS
  const heroGradient = isDarkMode 
    ? 'linear-gradient(135deg, #283f75ff 0%, #3a5277ff 100%)' 
    : 'linear-gradient(135deg, #e6e9f1ff 0%, #e0e7ff 100%)';

  // 2. NAVBAR CLASSES
  const navbarStyle = {
    background: heroGradient,
    transition: 'background 0.3s',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  };

  return (
    <div style={{ backgroundColor: theme.colors.bg, minHeight: '100vh', transition: 'background-color 0.3s' }}>
      
      {/* =======================
          0. BLENDED NAVBAR
      ======================= */}
      <nav className={`navbar navbar-expand-lg sticky-top shadow-sm py-3 ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`} 
           style={navbarStyle}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center fw-bold fs-4 text-primary">
            <FaHospital className="me-2" size={28} /> 
            TestInsure
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#homeNavbar">
            <FaBars className={isDarkMode ? "text-white" : "text-dark"} />
          </button>
          <div className="collapse navbar-collapse" id="homeNavbar">
            <ul className="navbar-nav ms-auto align-items-center gap-3">
              <li className="nav-item">
                <a href="#features" className="nav-link fw-medium opacity-75 hover-opacity-100" 
                   style={{ color: theme.colors.text }}>Features</a>
              </li>
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 fw-bold">Log In</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* =======================
          1. HERO SECTION
      ======================= */}
      <div style={{ background: heroGradient, paddingBottom: '4rem', transition: 'background 0.3s' }}>
        <div className="container py-5">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <div className="animate__animated animate__fadeInDown">
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 rounded-pill fw-bold mb-3">
                   Your Diagnostic Platform
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-3" style={{ letterSpacing: '-1px', color: theme.colors.text }}>
                Your Health, <br/>
                <span className="text-primary">
                  <Typewriter text="Digitally Managed." delay={100} />
                </span>
              </h1>
              <p className="lead mb-4 fw-medium animate__animated animate__fadeIn" style={{ color: theme.colors.textMuted, fontSize: '1.2rem', animationDelay: '1s' }}>
                Book appointments, track insurance claims, and access medical reports instantly. 
              </p>
              <div className="d-flex gap-3 animate__animated animate__fadeInUp" style={{ animationDelay: '0.5s' }}>
                <Link to="/login" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold d-flex align-items-center hover-lift">
                  Book Now <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/register" className={`btn btn-lg rounded-pill px-5 fw-bold ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`}>
                  Join as Patient
                </Link>
              </div>
            </div>
            
            {/* --- ANIMATED GRAPHIC (DIGITAL SCAN) --- */}
            <div className="col-lg-6 text-center mt-5 mt-lg-0 position-relative">
               
               {/* 1. Main Wrapper with Float + Emerge */}
               <div className="floating-animation emerge-animation position-relative d-inline-block" 
                    onClick={handleStethoscopeClick}
                    style={{ cursor: 'pointer' }}
                    title="System Online">
                 
                 {/* 2. Background Glow */}
                 <div className="position-absolute top-50 start-50 translate-middle w-75 h-75 bg-primary rounded-circle" 
                      style={{ filter: 'blur(80px)', opacity: 0.2 }}></div>
                 
                 {/* 3. The Stethoscope Icon */}
                 <FaStethoscope 
                    className={isHeartbeating ? 'heartbeat-effect' : ''}
                    style={{ fontSize: '18rem', color: '#3b82f6', position: 'relative', zIndex: 1 }} 
                 />

                 {/* 4. THE DIGITAL SCAN BEAM */}
                 {/* This overlay sits on top and clips to the stethoscope shape */}
                 <div className="scan-overlay" style={{
                   position: 'absolute',
                   top: 0, left: 0, width: '100%', height: '100%',
                   zIndex: 2,
                   pointerEvents: 'none', // Lets clicks pass through to the icon
                   overflow: 'hidden', // Ensures beam stays inside box
                   // Note: 'maskImage' fits the beam to the icon shape (Browser support varies, fallbacks to box scan)
                 }}>
                    <div className="scan-line"></div>
                 </div>

               </div>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          2. STATS STRIP
      ======================= */}
      <div className="bg-dark text-white py-5 shadow-lg position-relative" style={{ zIndex: 2, marginTop: '-3rem' }}>
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0 display-5"><CountUp end={24} suffix="/7" /></h2>
              <small className="text-white-50 text-uppercase fw-bold">Service Available</small>
            </div>
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0 display-5"><CountUp end={150} suffix="+" duration={2500}/></h2>
              <small className="text-white-50 text-uppercase fw-bold">Doctors</small>
            </div>
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0 display-5"><CountUp end={99} suffix="%" duration={3000}/></h2>
              <small className="text-white-50 text-uppercase fw-bold">Claims Approved</small>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold mb-0 display-5">100%</h2>
              <small className="text-white-50 text-uppercase fw-bold">Digital Reports</small>
            </div>
          </div>
        </div>
      </div>

      {/* =======================
          3. FEATURES
      ======================= */}
      <div id="features" className="container py-5 my-5">
        <div className="text-center mb-5">
          <h6 className="text-primary fw-bold text-uppercase">Why Choose Us</h6>
          <h2 className="fw-bold display-6" style={{ color: theme.colors.text }}>Comprehensive Care Features</h2>
        </div>
        <div className="row g-4">
          {[
            { icon: <FaUserMd size={40} />, color: 'success', title: 'Smart Scheduling', desc: 'Avoid waiting lines. View real-time availability.' },
            { icon: <FaShieldAlt size={40} />, color: 'info', title: 'Cashless Insurance', desc: 'Direct integration with major insurance providers.' },
            { icon: <FaFileMedical size={40} />, color: 'warning', title: 'Cloud Records', desc: 'Never lose a report again. Secured in the cloud.' }
          ].map((feature, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="p-4 border rounded-4 shadow-sm h-100 hover-card text-center transition-all"
                   style={{ backgroundColor: isDarkMode ? theme.colors.card : 'white', transition: 'all 0.3s ease' }}>
                <div className={`mb-3 d-inline-block p-3 rounded-circle bg-${feature.color} bg-opacity-10 text-${feature.color}`}>
                  {feature.icon}
                </div>
                <h4 className="fw-bold mt-2" style={{ color: theme.colors.text }}>{feature.title}</h4>
                <p style={{ color: theme.colors.textMuted }}>{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =======================
          4. FOOTER
      ======================= */}
      <footer className="bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <FaHospital className="text-primary me-2 fs-3" />
                <span className="fw-bold fs-4">TestInsure</span>
              </div>
              <p className="text-white-50">Revolutionizing hospital management.</p>
            </div>
            <div className="col-md-4 ms-auto mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Newsletter</h6>
              <div className="input-group">
                <input type="text" className="form-control bg-secondary border-0 text-white" placeholder="Email" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="text-center text-white-50 small">© 2025 TestInsure Hospital System.</div>
        </div>
      </footer>

      {/* STYLES */}
      <style>{`
        /* 1. Float */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .floating-animation { animation: float 6s ease-in-out infinite; }
        
        /* 2. Emerge */
        @keyframes emerge {
          from { opacity: 0; transform: scale(0.5) translateY(50px); }
          to { opacity: 1; transform: scale(1) translateY(0px); }
        }
        .emerge-animation {
          animation: emerge 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards, float 6s ease-in-out infinite 2.5s; 
        }

        /* 3. Heartbeat Click */
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.15); } 
          40% { transform: scale(1); }
          60% { transform: scale(1.15); } 
          100% { transform: scale(1); }
        }
        .heartbeat-effect { animation: heartbeat 0.6s ease-in-out; }

        /* 4. NEW: Digital Scan */
        @keyframes scan {
          0% { top: -20%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 120%; opacity: 0; }
        }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 30px; /* Thickness of beam */
          /* The beam gradient: transparent -> glowing cyan -> transparent */
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(100, 220, 255, 0.5) 50%, rgba(255,255,255,0));
          top: -20%;
          left: 0;
          /* Runs every 4 seconds, starts after 2.5s emerge */
          animation: scan 4s ease-in-out infinite 2.5s; 
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }

        .hover-lift { transition: transform 0.2s; }
        .hover-lift:hover { transform: translateY(-3px); }
        .hover-opacity-100:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default Home;