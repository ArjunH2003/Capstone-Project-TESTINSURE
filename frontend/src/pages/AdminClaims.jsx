import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FaFileInvoiceDollar, 
  FaUser, 
  FaShieldAlt, 
  FaCheck, 
  FaTimes, 
  FaVial, 
  FaClock, 
  FaCheckCircle, 
  FaBan,
  FaChartPie,
  FaFilter,
  FaEllipsisV,
  FaSearch
} from 'react-icons/fa';

const AdminClaims = () => {
  const [claims, setClaims] = useState([]);

  // 1. Fetch Claims on Load
  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/insurance/claims');
      setClaims(response.data);
    } catch (error) {
      toast.error("Failed to load claims.");
    }
  };

  // 2. Approve Logic
  const handleApprove = async (id) => {
    try {
      await api.put(`/insurance/claims/${id}/approve`);
      toast.success("Claim Approved Successfully!");
      fetchClaims(); 
    } catch (error) {
      toast.error("Approval Failed.");
    }
  };

  // 3. Reject Logic
  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason (Type 'Invalid Insurance' to block policy):");
    if (reason === null) return; 

    try {
      await api.put(`/insurance/claims/${id}/reject`, { reason: reason });
      toast.error("Claim Rejected.");
      fetchClaims();
    } catch (error) {
      toast.error("Rejection Failed.");
    }
  };

  // --- UI HELPERS ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Calculate Stats
  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === 'PENDING').length,
    approved: claims.filter(c => c.status === 'APPROVED').length,
    rejected: claims.filter(c => c.status === 'REJECTED').length,
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      {/* HEADER SECTION */}
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 text-primary me-3">
                  <FaFileInvoiceDollar size={24} />
                </div>
                <div>
                  <h3 className="fw-bold text-dark mb-1">Claims Adjudication</h3>
                  <p className="text-secondary mb-0">Manage insurance verification and payment approvals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        
        {/* 1. EXECUTIVE STATS CARDS */}
        <div className="row g-4 mb-5">
            {/* Total */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden stats-card">
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <div>
                            <p className="text-uppercase fw-bold text-muted small mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Total Claims</p>
                            <h2 className="fw-bold text-dark mb-0">{stats.total}</h2>
                        </div>
                        <div className="icon-box bg-light text-secondary">
                            <FaChartPie size={18} />
                        </div>
                    </div>
                    <div className="progress-line bg-primary"></div>
                </div>
            </div>

            {/* Pending */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden stats-card">
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <div>
                            <p className="text-uppercase fw-bold text-warning small mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Pending Review</p>
                            <h2 className="fw-bold text-dark mb-0">{stats.pending}</h2>
                        </div>
                        <div className="icon-box bg-warning bg-opacity-10 text-warning">
                            <FaClock size={18} />
                        </div>
                    </div>
                    <div className="progress-line bg-warning"></div>
                </div>
            </div>

            {/* Approved */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden stats-card">
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <div>
                            <p className="text-uppercase fw-bold text-success small mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Approved</p>
                            <h2 className="fw-bold text-dark mb-0">{stats.approved}</h2>
                        </div>
                        <div className="icon-box bg-success bg-opacity-10 text-success">
                            <FaCheckCircle size={18} />
                        </div>
                    </div>
                    <div className="progress-line bg-success"></div>
                </div>
            </div>

            {/* Rejected */}
            <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden stats-card">
                    <div className="card-body p-4 d-flex align-items-center justify-content-between">
                        <div>
                            <p className="text-uppercase fw-bold text-danger small mb-1" style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>Rejected</p>
                            <h2 className="fw-bold text-dark mb-0">{stats.rejected}</h2>
                        </div>
                        <div className="icon-box bg-danger bg-opacity-10 text-danger">
                            <FaBan size={18} />
                        </div>
                    </div>
                    <div className="progress-line bg-danger"></div>
                </div>
            </div>
        </div>

        {/* 2. DATA GRID */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="card-header bg-white pt-4 px-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
             <div className="d-flex align-items-center">
                <h6 className="fw-bold text-dark m-0 fs-5">Active Queue</h6>
                <span className="badge bg-light text-secondary border ms-3 rounded-pill px-3">{claims.length} records</span>
             </div>
             <div className="d-flex gap-2">
                <div className="input-group input-group-sm" style={{width: '200px'}}>
                    <span className="input-group-text bg-light border-end-0"><FaSearch className="text-muted"/></span>
                    <input type="text" className="form-control bg-light border-start-0" placeholder="Search ID..." />
                </div>
                <button className="btn btn-white border btn-sm text-muted fw-bold shadow-sm px-3">
                    <FaFilter className="me-2"/> Filter
                </button>
             </div>
          </div>
          
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Claim ID</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Patient</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Policy Info</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Test & Amount</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Status</th>
                    <th className="text-end pe-4 py-3 text-secondary text-uppercase fw-bold border-0 text-xxs tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {claims.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-5 text-muted fst-italic">No claims found in the system.</td></tr>
                  ) : (
                    claims.map(claim => (
                      <tr key={claim.claimId} className="hover-row transition-all border-bottom">
                        
                        {/* ID */}
                        <td className="ps-4 py-4">
                            <span className="font-monospace fw-bold text-dark fs-6">#{claim.claimId}</span>
                        </td>
                        
                        {/* PATIENT */}
                        <td className="py-4">
                           <div className="d-flex align-items-center">
                              <div className="avatar-circle bg-primary bg-opacity-10 text-primary me-3 fw-bold">
                                {claim.booking.user.name.charAt(0)}
                              </div>
                              <div className="lh-sm">
                                <span className="d-block fw-bold text-dark">{claim.booking.user.name}</span>
                                <small className="text-muted text-xs">{claim.booking.user.email}</small>
                              </div>
                           </div>
                        </td>

                        {/* POLICY */}
                        <td className="py-4">
                           <div className="d-flex align-items-center">
                              <div className="me-3 text-secondary opacity-50"><FaShieldAlt /></div>
                              <div className="lh-sm">
                                <span className="d-block fw-bold text-dark text-sm">{claim.policy.providerName}</span>
                                <span className="badge bg-light text-secondary border fw-normal text-xxs px-2 mt-1">
                                    {claim.policy.policyNumber}
                                </span>
                              </div>
                           </div>
                        </td>

                        {/* TEST & COST */}
                        <td className="py-4">
                           <div className="d-flex align-items-center">
                              <div className="me-3 text-secondary opacity-50"><FaVial /></div>
                              <div className="lh-sm">
                                <span className="d-block fw-medium text-secondary text-sm">{claim.booking.laboratoryTest.name}</span>
                                <span className="d-block fw-bolder text-dark mt-1 fs-6">
                                    {formatCurrency(claim.booking.laboratoryTest.cost)}
                                </span>
                              </div>
                           </div>
                        </td>

                        {/* STATUS */}
                        <td className="py-4">
                          {claim.status === 'PENDING' && (
                            <span className="status-pill status-pending">
                               <span className="dot bg-warning"></span> Pending Review
                            </span>
                          )}
                          {claim.status === 'APPROVED' && (
                            <div className="d-flex flex-column align-items-start gap-1">
                                <span className="status-pill status-success">
                                   <span className="dot bg-success"></span> Approved
                                </span>
                                <small className="text-success fw-bold ps-1" style={{fontSize: '10px'}}>
                                    + {formatCurrency(claim.approvedAmount)}
                                </small>
                            </div>
                          )}
                          {claim.status === 'REJECTED' && (
                            <span className="status-pill status-danger">
                               <span className="dot bg-danger"></span> Rejected
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="text-end pe-4 py-4">
                          {claim.status === 'PENDING' ? (
                            <div className="d-flex gap-2 justify-content-end">
                              <button 
                                className="btn btn-action-approve btn-sm shadow-sm"
                                onClick={() => handleApprove(claim.claimId)}
                                title="Approve Claim"
                              >
                                <FaCheck />
                              </button>
                              <button 
                                className="btn btn-action-reject btn-sm shadow-sm"
                                onClick={() => handleReject(claim.claimId)}
                                title="Reject Claim"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <button className="btn btn-light btn-sm text-muted border-0" disabled>
                                <FaEllipsisV />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Typography Helpers */
        .text-xxs { font-size: 0.7rem; }
        .text-xs { font-size: 0.75rem; }
        .text-sm { font-size: 0.875rem; }
        .tracking-wide { letter-spacing: 0.5px; }
        
        /* Stats Cards */
        .stats-card { transition: transform 0.2s ease; }
        .stats-card:hover { transform: translateY(-3px); }
        .icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .progress-line { height: 4px; width: 100%; }

        /* Table Styles */
        .hover-row:hover { background-color: #f8fafc; }
        .transition-all { transition: all 0.2s ease; }
        
        /* Avatar */
        .avatar-circle { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }

        /* Status Pills (The "Dot" Style) */
        .status-pill { 
            display: inline-flex; 
            align-items: center; 
            padding: 4px 12px; 
            border-radius: 50px; 
            font-size: 0.75rem; 
            font-weight: 600; 
            border: 1px solid transparent;
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; margin-right: 6px; }
        
        .status-pending { background-color: #fffbeb; color: #d97706; border-color: #fcd34d; }
        .status-success { background-color: #ecfdf5; color: #059669; border-color: #a7f3d0; }
        .status-danger { background-color: #fef2f2; color: #dc2626; border-color: #fecaca; }

        /* Action Buttons */
        .btn-white { background: white; }
        .btn-action-approve { 
            background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; width: 32px; height: 32px; 
            display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s;
        }
        .btn-action-approve:hover { background: #16a34a; color: white; transform: scale(1.05); }

        .btn-action-reject { 
            background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; width: 32px; height: 32px; 
            display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s;
        }
        .btn-action-reject:hover { background: #dc2626; color: white; transform: scale(1.05); }

      `}</style>
    </div>
  );
};

export default AdminClaims;