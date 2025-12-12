import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaFileInvoiceDollar, 
  FaFileMedical, 
  FaCalendarCheck, 
  FaShieldAlt, 
  FaTimesCircle, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaClock,
  FaCreditCard,
  FaUserInjured,
  FaFlagCheckered
} from 'react-icons/fa';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [policies, setPolicies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  
  const [newPolicy, setNewPolicy] = useState({ providerName: '', policyNumber: '', coverageAmount: '', expiryDate: '' });

  useEffect(() => {
    if (user) { fetchPolicies(); fetchBookings(); }
  }, [user]);

  const fetchPolicies = async () => { try { const res = await api.get('/insurance/policies'); setPolicies(res.data); } catch (err) { console.error(err); } };
  const fetchBookings = async () => { try { const res = await api.get('/bookings/my'); setBookings(res.data); } catch (err) { console.error(err); } };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      await api.post('/insurance/policies', newPolicy);
      toast.success("Policy Added Successfully!");
      setNewPolicy({ providerName: '', policyNumber: '', coverageAmount: '', expiryDate: '' });
      setShowPolicyForm(false);
      fetchPolicies(); 
    } catch (error) { toast.error("Failed to add policy."); }
  };

  const handleCancel = async (bookingId) => {
    if(!window.confirm("Are you sure?")) return;
    try { await api.put(`/bookings/${bookingId}/cancel`); toast.success("Cancelled"); fetchBookings(); } catch (error) { toast.error("Failed"); }
  };

  const downloadBill = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/bill`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a'); a.href = url; a.download = `bill_${bookingId}.pdf`; document.body.appendChild(a); a.click(); a.remove();
    } catch (error) { toast.error("Error downloading bill."); }
  };

  const downloadReport = async (bookingId) => {
    try {
      const response = await api.get(`/reports/download/${bookingId}`, { responseType: 'blob' });
      let filename = `report_${bookingId}`; 
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    } catch (error) { toast.info("Report yet to be uploaded."); }
  };

  return (
    // MAIN BACKGROUND: Professional Pale Blue-Grey
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--bs-body-font-family)' }}>
      <Navbar />
      
      {/* PROFESSIONAL HEADER BAR */}
      <div className="bg-white border-bottom py-4 mb-5 shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-3">
                <FaUserInjured className="me-1" /> Patient Portal
              </span>
              <span className="text-muted small border-start ps-2 ms-1">My Dashboard</span>
            </div>
            <h2 className="fw-bold text-dark m-0">Health Overview</h2>
          </div>
          
          <button 
            className="btn btn-primary rounded-pill px-4 shadow-sm fw-bold d-flex align-items-center" 
            onClick={() => navigate('/book-test')}
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <FaPlus className="me-2" /> Book New Test
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1rem' }}>
        <div className="row g-5">
          
          {/* --- LEFT: INSURANCE WALLET --- */}
          <div className="col-lg-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center" style={{letterSpacing: '0.5px'}}>
                <FaCreditCard className="me-2 text-primary"/> INSURANCE WALLET
              </h5>
              <button 
                className="btn btn-sm btn-white bg-white border shadow-sm text-primary fw-bold rounded-pill px-3" 
                onClick={() => setShowPolicyForm(!showPolicyForm)}
              >
                {showPolicyForm ? 'Close' : '+ Add Policy'}
              </button>
            </div>

            {/* Add Policy Form */}
            {showPolicyForm && (
              <div 
                className="card border-0 shadow-sm p-4 mb-4 rounded-4"
                style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}
              >
                <h6 className="fw-bold mb-3 text-dark">Link New Policy</h6>
                <form onSubmit={handleAddPolicy}>
                  <input type="text" className="form-control mb-2 border-0 shadow-sm" placeholder="Provider" value={newPolicy.providerName} onChange={(e) => setNewPolicy({...newPolicy, providerName: e.target.value})} required />
                  <input type="text" className="form-control mb-2 border-0 shadow-sm" placeholder="Policy Number" value={newPolicy.policyNumber} onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})} required />
                  <div className="row g-2 mb-3">
                    <div className="col"><input type="number" className="form-control border-0 shadow-sm" placeholder="Limit ($)" value={newPolicy.coverageAmount} onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: e.target.value})} required /></div>
                    <div className="col"><input type="date" className="form-control border-0 shadow-sm" value={newPolicy.expiryDate} onChange={(e) => setNewPolicy({...newPolicy, expiryDate: e.target.value})} required /></div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm">Save Card</button>
                </form>
              </div>
            )}

            {/* Insurance Cards */}
            {policies.length === 0 ? <div className="p-4 text-center border rounded-4 text-muted bg-white shadow-sm">No policies linked.</div> : (
              <div className="d-flex flex-column gap-3">
                {policies.map(p => (
                  <div key={p.policyId} 
                       className={`card border-0 text-white rounded-4 shadow-lg p-4 ${p.status === 'ACTIVE' ? 'bg-primary bg-gradient' : 'bg-danger bg-gradient'}`} 
                       style={{ 
                         backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                         position: 'relative', overflow: 'hidden', minHeight: '180px', transition: 'transform 0.3s ease'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                       onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <FaShieldAlt style={{position: 'absolute', right: -20, bottom: -20, fontSize: '8rem', opacity: 0.15}} />
                    <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
                      <div>
                        <small className="text-uppercase opacity-75 fw-bold" style={{fontSize: '0.7rem', letterSpacing: '1px'}}>Health Insurance</small>
                        <h4 className="mb-0 fw-bold mt-1">{p.providerName}</h4>
                      </div>
                      <span className={`badge ${p.status === 'ACTIVE' ? 'bg-white text-primary' : 'bg-white text-danger'} rounded-pill px-3 fw-bold shadow-sm`}>{p.status}</span>
                    </div>
                    <div className="mt-auto position-relative">
                      <div className="font-monospace fs-5 mb-3 opacity-90 text-shadow" style={{letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>{p.policyNumber}</div>
                      <div className="d-flex justify-content-between opacity-90 small fw-semibold">
                        <span>LIMIT: ${p.coverageAmount}</span>
                        <span>EXP: {p.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: APPOINTMENTS --- */}
          <div className="col-lg-8">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center" style={{letterSpacing: '0.5px'}}>
              <FaCalendarCheck className="me-2 text-primary"/> RECENT APPOINTMENTS
            </h5>
            
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="card-body p-0">
                {bookings.length === 0 ? (
                  <div className="p-5 text-center text-muted">
                    <FaCalendarCheck size={40} className="mb-3 opacity-25" />
                    <p>No appointments history found.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr className="text-secondary small text-uppercase fw-bold">
                          <th className="ps-4 py-3">Schedule</th>
                          <th className="py-3">Test Details</th>
                          <th className="py-3">Status</th>
                          <th className="py-3 text-end pe-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => {
                          
                          // DYNAMIC COLORS based on Status
                          let statusBadgeClass = "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25"; 
                          let icon = <FaClock className="me-1"/>;

                          if (b.status === 'CONFIRMED') {
                            statusBadgeClass = "bg-success bg-opacity-10 text-success border border-success border-opacity-25"; 
                            icon = <FaCheckCircle className="me-1"/>;
                          } else if (b.status === 'CANCELLED') {
                            statusBadgeClass = "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25"; 
                            icon = <FaTimesCircle className="me-1"/>;
                          } else if (b.status === 'COMPLETED') { // NEW STATUS STYLE
                            statusBadgeClass = "bg-info bg-opacity-10 text-info border border-info border-opacity-25"; 
                            icon = <FaFlagCheckered className="me-1"/>;
                          }

                          return (
                            <tr key={b.bookingId} style={{ height: '75px' }}>
                              <td className="ps-4">
                                <div className="d-flex align-items-center">
                                  {/* DATE BOX */}
                                  <div className="rounded-3 p-2 text-center me-3 border" 
                                       style={{ width: '55px', backgroundColor: '#eef2ff', borderColor: '#c7d2fe', color: '#3730a3' }}>
                                    <div className="fw-bold">{b.timeSlot.date.split('-')[2]}</div>
                                    <div className="small text-uppercase fw-bold" style={{fontSize: '10px'}}>{new Date(b.timeSlot.date).toLocaleString('default', { month: 'short' })}</div>
                                  </div>
                                  <div>
                                    <div className="fw-bold text-dark"><FaClock className="me-1 text-muted small"/>{b.timeSlot.startTime}</div>
                                    <small className="text-muted fw-semibold" style={{fontSize: '0.75rem'}}>ID: #{b.bookingId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold text-dark d-block" style={{fontSize: '0.95rem'}}>{b.laboratoryTest.name}</span>
                                <span className="small text-muted">Diagnostic Test</span>
                              </td>
                              <td>
                                {/* STATUS BADGE */}
                                <span className={`badge rounded-pill px-3 py-2 fw-bold ${statusBadgeClass}`}>
                                  {icon} {b.status}
                                </span>
                                
                                {b.status === 'CANCELLED' && b.paymentStatus === 'PENDING' ? (
                                  <div className="text-danger small mt-1 fw-bold" style={{fontSize: '0.75rem'}}><FaExclamationCircle className="me-1"/>Rejected</div>
                                ) : (
                                  b.status !== 'CANCELLED' && <div className="small text-muted fw-bold mt-1" style={{fontSize: '0.75rem'}}>Payment: {b.paymentStatus}</div>
                                )}
                              </td>
                              <td className="text-end pe-4">
                                <div className="d-flex justify-content-end gap-2">
                                  
                                  {/* RECEIPT (Always show unless cancelled) */}
                                  {b.status !== 'CANCELLED' && (
                                    <button onClick={() => downloadBill(b.bookingId)} className="btn btn-white border shadow-sm btn-sm rounded-2 text-dark fw-bold" title="Receipt">
                                      <FaFileInvoiceDollar className="me-1"/> Receipt
                                    </button>
                                  )}
                                  
                                  {/* RESULT BUTTON (Show if Completed or Paid) */}
                                  {(b.status === 'COMPLETED' || b.paymentStatus === 'PAID') && (
                                    <button onClick={() => downloadReport(b.bookingId)} className="btn btn-success shadow-sm btn-sm rounded-2 fw-bold" title="Result">
                                      <FaFileMedical className="me-1"/> Result
                                    </button>
                                  )}
                                  
                                  {/* CANCEL BUTTON (Visible ONLY if Confirmed AND Payment is NOT PAID) */}
                                  {/* This logic ensures Insurance Bookings (which are PAID immediately) cannot be cancelled */}
                                  {b.status === 'CONFIRMED' && b.paymentStatus !== 'PAID' && (
                                    <button onClick={() => handleCancel(b.bookingId)} className="btn btn-outline-danger btn-sm border-0 rounded-circle" title="Cancel" style={{width: '32px', height: '32px'}}>
                                      <FaTimesCircle />
                                    </button>
                                  )}

                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;