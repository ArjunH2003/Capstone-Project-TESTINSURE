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
  FaTimes, 
  FaClock, 
  FaHeartbeat,
  FaNotesMedical,
  FaSun,
  FaMoon,
  FaWifi,
  FaMicrochip,
  FaDownload,
  FaTrashAlt
} from 'react-icons/fa';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [policies, setPolicies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [newPolicy, setNewPolicy] = useState({ providerName: '', policyNumber: '', coverageAmount: '', expiryDate: '' });

  // Time Logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const GreetingIcon = hour < 18 ? FaSun : FaMoon;

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [policyRes, bookingRes] = await Promise.all([
        api.get('/insurance/policies'),
        api.get('/bookings/my')
      ]);
      setPolicies(policyRes.data);
      setBookings(bookingRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = async (e) => {
    e.preventDefault();
    try {
      await api.post('/insurance/policies', newPolicy);
      toast.success("Card Added to Wallet!");
      setNewPolicy({ providerName: '', policyNumber: '', coverageAmount: '', expiryDate: '' });
      setShowPolicyForm(false);
      fetchData(); 
    } catch (error) { toast.error("Failed to add policy."); }
  };

  const handleCancel = async (bookingId) => {
    if(!window.confirm("Cancel this appointment?")) return;
    try { await api.put(`/bookings/${bookingId}/cancel`); toast.success("Cancelled"); fetchData(); } catch (error) { toast.error("Failed."); }
  };

  const downloadBill = async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/bill`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a'); a.href = url; a.download = `bill_${bookingId}.pdf`; document.body.appendChild(a); a.click(); a.remove();
    } catch (error) { toast.error("Receipt not available."); }
  };

  const downloadReport = async (bookingId) => {
    try {
      const response = await api.get(`/reports/download/${bookingId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a'); a.href = url; a.download = `report_${bookingId}.pdf`; document.body.appendChild(a); a.click(); a.remove();
    } catch (error) { toast.info("Report pending upload."); }
  };

  // Next Session Logic
  const nextAppointment = bookings
    .filter(b => b.status === 'CONFIRMED' && new Date(b.timeSlot.date + ' ' + b.timeSlot.startTime) >= new Date())
    .sort((a, b) => new Date(a.timeSlot.date + ' ' + a.timeSlot.startTime) - new Date(b.timeSlot.date + ' ' + b.timeSlot.startTime))[0];

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      
      {/* 1. HEADER SECTION */}
      <div className="bg-white border-bottom pb-5 pt-4 mb-5 shadow-sm position-relative overflow-hidden">
        <div className="container position-relative z-1">
          <div className="d-flex justify-content-between align-items-end mb-4 animate-slide-down">
            <div>
               <div className="d-flex align-items-center text-secondary mb-1 small fw-bold text-uppercase tracking-wide">
                  <GreetingIcon className="me-2 text-warning" /> {greeting}
               </div>
               <h2 className="fw-bolder text-dark display-6 mb-0">
                  {user?.name}
               </h2>
            </div>
            <button 
                className="btn btn-dark rounded-pill px-4 py-2 shadow-lg fw-bold d-flex align-items-center hover-lift"
                onClick={() => navigate('/book-test')}
            >
                <FaPlus className="me-2 text-warning"/> Book Test
            </button>
          </div>

          {/* NEXT APPOINTMENT HERO CARD */}
          {nextAppointment && (
            <div className="card border-0 rounded-4 shadow-lg overflow-hidden mb-4 text-white animate-fade-in"
                 style={{background: 'linear-gradient(120deg, #4f46e5, #3b82f6)'}}>
                <div className="card-body p-4 position-relative">
                    <FaCalendarCheck className="position-absolute opacity-25" style={{right: -30, bottom: -40, fontSize: '12rem', transform: 'rotate(-15deg)'}} />
                    <div className="d-flex align-items-center mb-3">
                        <span className="badge bg-blue-600 bg-opacity-20 backdrop-blur border border-red border-opacity-95 px-3 py-2 rounded-pill">NEXT VISIT</span>
                    </div>
                    <h3 className="fw-bold mb-1">{nextAppointment.laboratoryTest.name}</h3>
                    <div className="d-flex align-items-center mt-3 opacity-90 fw-medium">
                        <FaClock className="me-2"/> 
                        {new Date(nextAppointment.timeSlot.date).toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'})} at {nextAppointment.timeSlot.startTime.substring(0,5)}
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem' }}>
        <div className="row g-5">
          
          {/* --- LEFT: INSURANCE WALLET --- */}
          <div className="col-lg-4 animate-slide-up">
            <h6 className="text-uppercase fw-bold text-muted small mb-3 tracking-wide">Insurance Wallet</h6>

            <div className="d-flex flex-column gap-3">
                {/* 1. EXISTING CARDS */}
                {policies.map((p, idx) => (
                  <div key={p.policyId} 
                       className="credit-card-wrap" 
                       style={{animationDelay: `${idx * 0.1}s`}}>
                    <div className={`credit-card p-4 text-white shadow-lg ${p.status === 'ACTIVE' ? 'bg-gradient-dark' : 'bg-gradient-red'}`}>
                        {/* Chip & Wifi */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <FaMicrochip size={36} className="text-warning opacity-75" />
                            <FaWifi size={24} className="opacity-50 rotate-90" />
                        </div>
                        
                        {/* Number */}
                        <div className="font-monospace fs-5 mb-4 text-shadow tracking-widest text-truncate">
                            **** **** {p.policyNumber.slice(-4) || '0000'}
                        </div>

                        {/* Footer Info */}
                        <div className="d-flex justify-content-between align-items-end">
                            <div>
                                <small className="d-block text-uppercase opacity-50" style={{fontSize: '0.6rem'}}>Provider</small>
                                <span className="fw-bold">{p.providerName}</span>
                            </div>
                            <div className="text-end">
                                <small className="d-block text-uppercase opacity-50" style={{fontSize: '0.6rem'}}>Coverage</small>
                                <span className="fw-bold">${p.coverageAmount}</span>
                            </div>
                        </div>

                        {/* Status Tag */}
                        <div className="position-absolute top-0 end-0 mt-3 me-3">
                            <span className={`badge ${p.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'} rounded-1 px-2`}>{p.status}</span>
                        </div>
                    </div>
                  </div>
                ))}

                {/* 2. "GHOST" ADD CARD BUTTON */}
                {!showPolicyForm ? (
                    <button 
                        onClick={() => setShowPolicyForm(true)}
                        className="btn btn-dashed w-100 p-4 rounded-4 text-muted fw-bold d-flex flex-column align-items-center justify-content-center hover-bg-light transition-all"
                        style={{border: '2px dashed #cbd5e1', height: '180px'}}
                    >
                        <div className="bg-white p-3 rounded-circle shadow-sm mb-2 text-primary">
                            <FaPlus size={20}/>
                        </div>
                        Add Insurance Policy
                    </button>
                ) : (
                    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white animate-fade-in border-top border-4 border-primary">
                        <div className="d-flex justify-content-between mb-3">
                            <h6 className="fw-bold m-0 text-dark">New Policy Details</h6>
                            <button onClick={() => setShowPolicyForm(false)} className="btn-close small"></button>
                        </div>
                        <form onSubmit={handleAddPolicy}>
                            <input type="text" className="form-control bg-light border-0 mb-2 fw-bold" placeholder="Provider (e.g. Aetna)" value={newPolicy.providerName} onChange={(e) => setNewPolicy({...newPolicy, providerName: e.target.value})} required />
                            <input type="text" className="form-control bg-light border-0 mb-2 font-monospace" placeholder="Policy Number" value={newPolicy.policyNumber} onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})} required />
                            <div className="row g-2 mb-3">
                                <div className="col"><input type="number" className="form-control bg-light border-0" placeholder="Limit $" value={newPolicy.coverageAmount} onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: e.target.value})} required /></div>
                                <div className="col"><input type="date" className="form-control bg-light border-0" value={newPolicy.expiryDate} onChange={(e) => setNewPolicy({...newPolicy, expiryDate: e.target.value})} required /></div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold shadow-sm">Confirm & Add</button>
                        </form>
                    </div>
                )}
            </div>
          </div>

          {/* --- RIGHT: APPOINTMENTS TABLE --- */}
          <div className="col-lg-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="text-uppercase fw-bold text-muted small tracking-wide">Recent Activity</h6>
            </div>
            
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
              <div className="card-body p-0">
                {bookings.length === 0 ? (
                  <div className="p-5 text-center">
                    <div className="bg-light p-4 rounded-circle d-inline-block mb-3">
                        <FaNotesMedical size={40} className="text-muted opacity-50" />
                    </div>
                    <h5 className="fw-bold text-dark">No History Yet</h5>
                    <p className="text-muted small">Your medical journey starts here.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr className="text-secondary small text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>
                          <th className="ps-4 py-3 border-0">Timeline</th>
                          <th className="py-3 border-0">Service</th>
                          <th className="py-3 border-0">Status</th>
                          <th className="py-3 text-end pe-4 border-0">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => {
                          const isPaid = b.paymentStatus === 'PAID';
                          return (
                            <tr key={b.bookingId} className="border-bottom border-light">
                              <td className="ps-4 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="rounded-3 text-center me-3 border border-light bg-light shadow-sm" style={{width: '50px', height: '50px', padding: '6px'}}>
                                    <span className="d-block fw-bold text-dark h6 mb-0 lh-1">{b.timeSlot.date.split('-')[2]}</span>
                                    <span className="d-block text-uppercase fw-bold text-muted" style={{fontSize: '0.65rem'}}>
                                        {new Date(b.timeSlot.date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="fw-bold text-dark small">{b.timeSlot.startTime.substring(0,5)}</div>
                                    <small className="text-muted" style={{fontSize: '0.7rem'}}>#{b.bookingId}</small>
                                  </div>
                                </div>
                              </td>
                              
                              <td>
                                <span className="fw-bold text-dark d-block small">{b.laboratoryTest.name}</span>
                                <span className="text-muted small" style={{fontSize: '0.75rem'}}>Diagnostic Lab</span>
                              </td>
                              
                              <td>
                                {b.status === 'CONFIRMED' && <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">Confirmed</span>}
                                {b.status === 'COMPLETED' && <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1">Completed</span>}
                                {b.status === 'CANCELLED' && <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1">Cancelled</span>}
                                {!isPaid && b.status !== 'CANCELLED' && <div className="text-warning fw-bold mt-1" style={{fontSize: '0.65rem'}}>• Payment Pending</div>}
                              </td>
                              
                              <td className="text-end pe-4">
                                <div className="d-flex justify-content-end gap-2">
                                  {/* BILL BUTTON */}
                                  {b.status !== 'CANCELLED' && (
                                    <button 
                                        onClick={() => downloadBill(b.bookingId)} 
                                        className="btn btn-light btn-sm border shadow-sm text-secondary d-flex align-items-center tooltip-btn"
                                        title="Download Receipt"
                                    >
                                      <FaFileInvoiceDollar />
                                    </button>
                                  )}
                                  
                                  {/* REPORT BUTTON */}
                                  {(b.status === 'COMPLETED' || isPaid) && (
                                    <button 
                                        onClick={() => downloadReport(b.bookingId)} 
                                        className="btn btn-primary btn-sm shadow-sm d-flex align-items-center fw-bold"
                                        title="View Report"
                                    >
                                      <FaDownload className="me-1" size={12}/> Report
                                    </button>
                                  )}
                                  
                                  {/* CANCEL BUTTON */}
                                  {b.status === 'CONFIRMED' && !isPaid && (
                                    <button 
                                        onClick={() => handleCancel(b.bookingId)} 
                                        className="btn btn-white btn-sm text-danger border border-danger border-opacity-25 shadow-sm"
                                        title="Cancel"
                                    >
                                      <FaTrashAlt size={12}/>
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

      <style>{`
        /* Credit Card Styles */
        .credit-card-wrap { perspective: 1000px; animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        .credit-card {
            border-radius: 16px;
            position: relative;
            overflow: hidden;
            transition: transform 0.3s;
        }
        .credit-card:hover { transform: translateY(-5px); }
        .bg-gradient-dark { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); } /* Slate 900 */
        .bg-gradient-red { background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); }   /* Red 800 */
        
        .tracking-widest { letter-spacing: 0.15em; }
        .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .rotate-90 { transform: rotate(90deg); }

        /* Button Hover Effects */
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
        .hover-bg-light:hover { background-color: #f8fafc; color: #3b82f6; }
        .transition-all { transition: all 0.3s ease; }

        /* Animations */
        .animate-slide-down { animation: slideDown 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }

        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PatientDashboard;