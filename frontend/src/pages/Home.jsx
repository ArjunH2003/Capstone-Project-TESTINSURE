import { Link } from 'react-router-dom';
import { FaStethoscope, FaFileMedical, FaShieldAlt, FaArrowRight, FaUserMd, FaHospital, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-white">
      
      {/* 1. HERO SECTION (High Contrast) */}
      <div style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)' }}>
        <div className="container py-5">
          <div className="row align-items-center py-5">
            <div className="col-lg-6">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2 rounded-pill fw-bold mb-3">
                Your Diagnostic Platform
              </span>
              <h1 className="display-3 fw-bold text-dark mb-3" style={{ letterSpacing: '-1px' }}>
                Your Health, <br/>
                <span className="text-primary">Digitally Managed.</span>
              </h1>
              <p className="lead mb-4 fw-medium" style={{ color: '#1e293b', fontSize: '1.2rem' }}>
                Book appointments, track insurance claims, and access medical reports instantly. 
                Experience the future of healthcare management today.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg fw-bold d-flex align-items-center">
                  Book Now <FaArrowRight className="ms-2" />
                </Link>
                <Link to="/register" className="btn btn-outline-dark btn-lg rounded-pill px-5 fw-bold">
                  Join as Patient
                </Link>
              </div>
              
              <div className="mt-4 d-flex align-items-center gap-3">
                <div className="d-flex text-warning">
                  <FaCheckCircle className="me-1" /><FaCheckCircle className="me-1" /><FaCheckCircle className="me-1" /><FaCheckCircle className="me-1" /><FaCheckCircle />
                </div>
                <span className="fw-bold text-dark small"></span>
              </div>
            </div>
            
            {/* Hero Graphic */}
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
               <div className="position-relative d-inline-block">
                 <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary rounded-circle" style={{ filter: 'blur(80px)', opacity: 0.2 }}></div>
                 <FaStethoscope style={{ fontSize: '18rem', color: '#2563eb', position: 'relative', zIndex: 1 }} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS STRIP (Authority) */}
      <div className="bg-dark text-white py-4">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0">24/7</h2>
              <small className="text-white-50 text-uppercase fw-bold">Service Available</small>
            </div>
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0">150+</h2>
              <small className="text-white-50 text-uppercase fw-bold">Specialist Doctors</small>
            </div>
            <div className="col-md-3 border-end border-secondary">
              <h2 className="fw-bold mb-0">99%</h2>
              <small className="text-white-50 text-uppercase fw-bold">Claims Approved</small>
            </div>
            <div className="col-md-3">
              <h2 className="fw-bold mb-0">Instant</h2>
              <small className="text-white-50 text-uppercase fw-bold">Digital Reports</small>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FEATURES SECTION (Cards) */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
          <h6 className="text-primary fw-bold text-uppercase">Why Choose Us</h6>
          <h2 className="fw-bold text-dark display-6">Comprehensive Care Features</h2>
        </div>

        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-md-4">
            <div className="p-4 border border-dark border-opacity-10 rounded-4 shadow-sm h-100 bg-white hover-card text-center">
              <div className="mb-3 d-inline-block p-3 rounded-circle bg-success bg-opacity-10 text-success">
                <FaUserMd size={40} />
              </div>
              <h4 className="fw-bold text-dark mt-2">Smart Scheduling</h4>
              <p style={{ color: '#334155' }}>
                Avoid waiting lines. View real-time availability of doctors and diagnostic machines and book slots instantly.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-4">
            <div className="p-4 border border-dark border-opacity-10 rounded-4 shadow-sm h-100 bg-white hover-card text-center">
              <div className="mb-3 d-inline-block p-3 rounded-circle bg-info bg-opacity-10 text-info">
                <FaShieldAlt size={40} />
              </div>
              <h4 className="fw-bold text-dark mt-2">Cashless Insurance</h4>
              <p style={{ color: '#334155' }}>
                Direct integration with major insurance providers. We handle the paperwork so you can focus on recovery.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-4">
            <div className="p-4 border border-dark border-opacity-10 rounded-4 shadow-sm h-100 bg-white hover-card text-center">
              <div className="mb-3 d-inline-block p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                <FaFileMedical size={40} />
              </div>
              <h4 className="fw-bold text-dark mt-2">Cloud Records</h4>
              <p style={{ color: '#334155' }}>
                Never lose a report again. All your invoices, prescriptions, and lab results are stored securely in the cloud.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER */}
      <footer className="bg-dark text-white pt-5 pb-3 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <FaHospital className="text-primary me-2 fs-3" />
                <span className="fw-bold fs-4">TestInsure</span>
              </div>
              <p className="text-white-50">
                Revolutionizing hospital management with secure, efficient, and patient-centric digital solutions.
              </p>
            </div>
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Platform</h6>
              <ul className="list-unstyled text-white-50">
                <li><Link to="/login" className="text-decoration-none text-white-50">Patient Login</Link></li>
                <li><Link to="/register" className="text-decoration-none text-white-50">Register</Link></li>
                <li><Link to="/admin-dashboard" className="text-decoration-none text-white-50">Admin Portal</Link></li>
              </ul>
            </div>
            <div className="col-md-2 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Support</h6>
              <ul className="list-unstyled text-white-50">
                <li><a href="#" className="text-decoration-none text-white-50">Help Center</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Privacy Policy</a></li>
                <li><a href="#" className="text-decoration-none text-white-50">Terms of Service</a></li>
              </ul>
            </div>
            <div className="col-md-4 mb-4">
              <h6 className="fw-bold text-uppercase mb-3">Newsletter</h6>
              <p className="text-white-50 small">Subscribe for health updates.</p>
              <div className="input-group">
                <input type="text" className="form-control bg-secondary border-0 text-white" placeholder="Email address" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
          <hr className="border-secondary" />
          <div className="text-center text-white-50 small">
            © 2025 TestInsure Hospital System. All rights reserved. Built with Spring Boot & React.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;