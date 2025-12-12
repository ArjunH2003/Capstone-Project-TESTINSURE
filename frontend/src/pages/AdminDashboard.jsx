import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  FaVials, 
  FaClock, 
  FaFileSignature, 
  FaFileUpload, 
  FaArrowRight, 
  FaHospitalUser,
  FaStethoscope,
  FaMoneyCheckAlt
} from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Color Mapping for "Pale" backgrounds
  const themeColors = {
    primary: { bg: '#eef2ff', border: '#c7d2fe', text: '#3730a3' }, // Indigo Tint
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' }, // Emerald Tint
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' }, // Amber Tint
    info:    { bg: '#ecfeff', border: '#a5f3fc', text: '#155e75' }  // Cyan Tint
  };

  // Reusable Action Card (Main Grid)
  const ActionCard = ({ title, subtitle, icon, link, color }) => {
    const theme = themeColors[color];

    return (
      <div className="col-12 mb-4">
        <div 
          className="card h-100 border-0 shadow-sm rounded-4 hover-card" 
          style={{ 
            backgroundColor: theme.bg, // Pale Background
            cursor: 'pointer', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: `1px solid ${theme.border}`
          }}
          onClick={() => navigate(link)}
        >
          <div className="card-body p-4 d-flex align-items-center position-relative overflow-hidden">
            
            {/* Subtle Watermark Icon */}
            <div style={{ position: 'absolute', right: -10, top: -10, fontSize: '6rem', opacity: 0.05, color: 'black', transform: 'rotate(15deg)' }}>
              {icon}
            </div>

            {/* Icon Bubble (Left Side) */}
            <div className={`p-3 rounded-circle bg-white shadow-sm text-${color} me-4`} style={{ minWidth: '60px', textAlign: 'center' }}>
              {icon}
            </div>
            
            {/* Text Content */}
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1" style={{ color: theme.text }}>{title}</h5>
              <p className="text-muted small mb-0 fw-medium">{subtitle}</p>
            </div>
            
            {/* Arrow Action */}
            <div className={`btn btn-white bg-white text-${color} rounded-circle p-2 shadow-sm d-flex align-items-center justify-content-center`} style={{width: '40px', height: '40px'}}>
               <FaArrowRight />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    // MAIN BACKGROUND: Pale Blue-Grey (#f0f4f8)
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--bs-body-font-family)' }}>
      <Navbar />
      
      {/* PROFESSIONAL HEADER BAR */}
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3">
                <FaHospitalUser className="me-1" /> Hospital Operations Portal
              </span>
            </div>
            <h2 className="fw-bold text-dark m-0">System Overview</h2>
          </div>
          
          {/* RESTORED: Current Session (Date) */}
          <div className="text-end d-none d-md-block">
             <p className="text-muted small mb-0">Current Session</p>
             <p className="fw-bold text-dark mb-0">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1rem' }}>
        
        <div className="row g-5">
            
            {/* --- LEFT COLUMN: CLINICAL OPS --- */}
            <div className="col-lg-6">
                <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                    <FaStethoscope className="text-primary me-2 fs-5" />
                    <h6 className="fw-bold text-secondary text-uppercase m-0 ls-1" style={{letterSpacing:'1px'}}>Clinical Resources</h6>
                </div>
                
                <div className="row">
                    <ActionCard 
                        title="Diagnostic Tests" 
                        subtitle="Manage test inventory & pricing."
                        icon={<FaVials size={24} />}
                        link="/admin/tests"
                        color="primary"
                    />
                    <ActionCard 
                        title="Schedule Management" 
                        subtitle="Configure machine availability."
                        icon={<FaClock size={24} />}
                        link="/admin/slots"
                        color="success"
                    />
                </div>
            </div>

            {/* --- RIGHT COLUMN: FINANCIAL OPS --- */}
            <div className="col-lg-6">
                <div className="d-flex align-items-center mb-4 border-bottom pb-2">
                    <FaMoneyCheckAlt className="text-warning me-2 fs-5" />
                    <h6 className="fw-bold text-secondary text-uppercase m-0 ls-1" style={{letterSpacing:'1px'}}>Financial & Records</h6>
                </div>

                <div className="row">
                    <ActionCard 
                        title="Insurance Verification" 
                        subtitle="Verify claims & process approvals."
                        icon={<FaFileSignature size={24} />}
                        link="/admin/claims"
                        color="warning" 
                    />
                    <ActionCard 
                        title="Medical Reports" 
                        subtitle="Upload patient diagnostic results."
                        icon={<FaFileUpload size={24} />}
                        link="/admin/reports"
                        color="info" 
                    />
                </div>
            </div>

        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-muted small pb-4">
          <p className="mb-0">Operations Management Panel &copy; 2025. Authorized Personnel Only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;