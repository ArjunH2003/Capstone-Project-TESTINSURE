import { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FaStethoscope, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaArrowRight,
  FaFileInvoice
} from 'react-icons/fa';

const BookTest = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Data
  const [tests, setTests] = useState([]);
  const [slots, setSlots] = useState([]);
  const [policies, setPolicies] = useState([]);

  // Selections
  const [selectedTest, setSelectedTest] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [selectedPolicy, setSelectedPolicy] = useState('');

  // Helper State
  const [activeTestObj, setActiveTestObj] = useState(null);
  const [activeSlotObj, setActiveSlotObj] = useState(null);

  useEffect(() => {
    fetchTests();
    fetchPolicies();
  }, []);

  // 2. Load Slots when Test changes
  useEffect(() => {
    setSelectedSlot(''); 
    setActiveSlotObj(null);

    if (selectedTest) {
      fetchSlots(selectedTest);
      const t = tests.find(test => test.testId.toString() === selectedTest.toString());
      setActiveTestObj(t);
    } else {
      setSlots([]);
      setActiveTestObj(null);
    }
  }, [selectedTest]);

  useEffect(() => {
    if (selectedSlot) {
      const s = slots.find(slot => slot.slotId.toString() === selectedSlot.toString());
      setActiveSlotObj(s);
    } else {
      setActiveSlotObj(null);
    }
  }, [selectedSlot]);

  const fetchTests = async () => {
    try { const res = await api.get('/tests'); setTests(res.data); } 
    catch (err) { toast.error("Failed to load tests"); }
  };

  const fetchSlots = async (testId) => {
    try { const res = await api.get(`/tests/${testId}/slots`); setSlots(res.data); } 
    catch (err) { toast.error("Failed to load slots"); }
  };

  const fetchPolicies = async () => {
    try { const res = await api.get('/insurance/policies'); setPolicies(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleBooking = async () => {
    if (!selectedTest || !selectedSlot) { toast.error("Please complete all steps."); return; }
    if (paymentMethod === 'insurance' && !selectedPolicy) { toast.error("Select a policy."); return; }

    const bookingPayload = {
      testId: selectedTest,
      slotId: selectedSlot,
      isInsurance: paymentMethod === 'insurance',
      policyId: paymentMethod === 'insurance' ? selectedPolicy : null
    };

    try {
      await api.post('/bookings', bookingPayload);
      toast.success("Booking Confirmed!");
      navigate('/patient-dashboard');
    } catch (error) {
      let msg = "Booking Failed.";
      if (error.response && error.response.data) {
         if (error.response.data.message) msg = error.response.data.message;
         else if (typeof error.response.data === 'string') msg = error.response.data;
      }
      toast.error(msg);
    }
  };

  // NEW: Refined Step Header (Pale Blue Pill)
  const StepHeader = ({ step, title, icon }) => (
    <div className="d-flex align-items-center mb-4 p-2 rounded-pill" style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #2563eb' }}>
      <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm border border-primary border-opacity-25" 
           style={{width: '32px', height: '32px', fontSize: '0.9rem', marginLeft: '2px'}}>
        {step}
      </div>
      <h6 className="mb-0 fw-bold text-dark d-flex align-items-center" style={{fontSize: '0.95rem', letterSpacing: '0.3px'}}>
        {icon} <span className="ms-2 text-uppercase text-secondary" style={{fontSize: '0.8rem'}}>{title}</span>
      </h6>
    </div>
  );

  return (
    // MAIN BG: Ice Blue (#eff6ff)
    <div style={{ backgroundColor: '#eff6ff', minHeight: '100vh', fontSize: '0.9rem' }}>
      <Navbar />
      
      <div className="container py-5">
        <div className="row g-5">
          
          {/* LEFT: BOOKING FORM (Clean White on Ice Blue) */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-5 bg-white h-100">
              <h4 className="fw-bold text-primary mb-1">New Appointment</h4>
              <p className="text-muted small mb-5">Please select your preferred diagnostic service and schedule.</p>
              
              {/* STEP 1: TEST */}
              <div className="mb-5">
                <StepHeader step="1" title="Select Service" icon={<FaStethoscope />} />
                <div className="ps-4 ms-2">
                  <select 
                    className="form-select border-2 shadow-sm" 
                    value={selectedTest} 
                    onChange={(e) => setSelectedTest(e.target.value)}
                    style={{ borderColor: activeTestObj ? '#2563eb' : '#e2e8f0', fontSize: '0.95rem', padding: '0.7rem' }}
                  >
                    <option value="">-- Choose Diagnostic Test --</option>
                    {tests.map(t => (
                      <option key={t.testId} value={t.testId}>{t.name} — ${t.cost}</option>
                    ))}
                  </select>
                  {activeTestObj && (
                    <div className="mt-3 text-dark small bg-primary bg-opacity-10 p-3 rounded-3 border border-primary border-opacity-25">
                      <strong>Description:</strong> {activeTestObj.description} <br/>
                      <span className="text-danger fw-bold mt-1 d-block">Preparation: {activeTestObj.prepInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP 2: SLOT */}
              <div className="mb-5">
                <StepHeader step="2" title="Select Schedule" icon={<FaCalendarAlt />} />
                <div className="ps-4 ms-2">
                  <select 
                    className="form-select border-2 shadow-sm" 
                    value={selectedSlot} 
                    onChange={(e) => setSelectedSlot(e.target.value)} 
                    disabled={!selectedTest}
                    style={{ fontSize: '0.95rem', padding: '0.7rem' }}
                  >
                    <option value="">-- Available Time Slots --</option>
                    {slots.map(s => (
                      <option key={s.slotId} value={s.slotId} disabled={s.capacity <= 0}>
                        {s.date} @ {s.startTime} — {s.capacity > 0 ? `${s.capacity} spots available` : 'SOLD OUT'}
                      </option>
                    ))}
                  </select>
                  {slots.length === 0 && selectedTest && <small className="text-danger mt-2 d-block fw-bold px-1">No slots available for this test.</small>}
                </div>
              </div>

              {/* STEP 3: PAYMENT */}
              <div className="mb-2">
                <StepHeader step="3" title="Payment Method" icon={<FaCreditCard />} />
                <div className="ps-4 ms-2">
                  
                  {/* Visual Toggle Cards */}
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <div 
                        onClick={() => setPaymentMethod('cash')}
                        className={`card p-3 border-2 cursor-pointer h-100 ${paymentMethod === 'cash' ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`p-2 rounded-circle me-3 ${paymentMethod === 'cash' ? 'bg-primary text-white' : 'bg-white text-secondary'}`}>
                            <FaCreditCard size={16}/>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0 text-dark" style={{fontSize: '0.9rem'}}>Pay Yourself</h6>
                            <small className="text-muted" style={{fontSize: '0.75rem'}}>Credit/Debit Card</small>
                          </div>
                          {paymentMethod === 'cash' && <FaCheckCircle className="ms-auto text-primary" />}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div 
                        onClick={() => setPaymentMethod('insurance')}
                        className={`card p-3 border-2 cursor-pointer h-100 ${paymentMethod === 'insurance' ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <div className="d-flex align-items-center">
                          <div className={`p-2 rounded-circle me-3 ${paymentMethod === 'insurance' ? 'bg-primary text-white' : 'bg-white text-secondary'}`}>
                            <FaShieldAlt size={16}/>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0 text-dark" style={{fontSize: '0.9rem'}}>Use Insurance</h6>
                            <small className="text-muted" style={{fontSize: '0.75rem'}}>Cashless Claim</small>
                          </div>
                          {paymentMethod === 'insurance' && <FaCheckCircle className="ms-auto text-primary" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form Content (Pale Backgrounds) */}
                  {paymentMethod === 'cash' ? (
                    <div className="p-4 rounded-4 border" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="fw-bold mb-3 text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>Card Details (Simulation)</label>
                      <div className="input-group mb-3">
                        <span className="input-group-text bg-white border-end-0 text-muted"><FaCreditCard/></span>
                        <input type="text" className="form-control border-start-0 ps-0 form-control-sm bg-white" placeholder="0000 0000 0000 0000" maxLength="19" />
                      </div>
                      <div className="row g-2">
                        <div className="col-6"><input type="text" className="form-control form-control-sm bg-white" placeholder="MM/YY" /></div>
                        <div className="col-6"><input type="password" className="form-control form-control-sm bg-white" placeholder="CVV" /></div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-4 border" style={{ backgroundColor: '#f8fafc' }}>
                      <label className="fw-bold mb-3 text-secondary text-uppercase" style={{fontSize: '0.7rem'}}>Select Policy</label>
                      {policies.filter(p => p.status === 'ACTIVE').length > 0 ? (
                        <select className="form-select form-select-sm bg-white shadow-sm" value={selectedPolicy} onChange={(e) => setSelectedPolicy(e.target.value)}>
                          <option value="">-- Choose Active Policy --</option>
                          {policies.filter(p => p.status === 'ACTIVE').map(p => (
                            <option key={p.policyId} value={p.policyId}>{p.providerName} — #{p.policyNumber}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="alert alert-warning mb-0 border-0 p-2 small shadow-sm">No active policies found.</div>
                      )}
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: SUMMARY (Ticket Style) */}
          <div className="col-lg-4">
            <div className="card border-0 shadow rounded-4 overflow-hidden position-sticky" style={{ top: '100px', backgroundColor: '#fff' }}>
              
              {/* TICKET HEADER */}
              <div className="bg-primary p-4 text-white position-relative overflow-hidden">
                <FaFileInvoice style={{ position: 'absolute', right: -10, top: -10, fontSize: '6rem', opacity: 0.1 }} />
                <h5 className="fw-bold mb-1">Booking Summary</h5>
                <small className="opacity-75">Review your booking details</small>
              </div>

              <div className="card-body p-4">
                {/* DETAILS */}
                <div className="mb-3">
                  <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>Test Selected</small>
                  <div className="fs-6 fw-bold text-dark border-bottom pb-2">{activeTestObj ? activeTestObj.name : '---'}</div>
                </div>

                <div className="mb-4">
                  <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.65rem', letterSpacing: '1px'}}>Date & Time</small>
                  <div className="small fw-bold text-dark border-bottom pb-2">{activeSlotObj ? `${activeSlotObj.date} at ${activeSlotObj.startTime}` : '---'}</div>
                </div>

                {/* PRICE BREAKDOWN (Pale Background Box) */}
                <div className="rounded-3 p-3 mb-4" style={{ backgroundColor: '#f1f5f9' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1 small">
                    <span className="text-secondary">Consultation</span>
                    <span className="fw-bold text-dark">${activeTestObj ? activeTestObj.cost : '0.00'}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2 small">
                    <span className="text-secondary">Discount</span>
                    <span className="fw-bold text-success">-$0.00</span>
                  </div>
                  <hr className="border-secondary opacity-25 my-2"/>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">TOTAL</span>
                    <span className="fs-5 fw-bold text-primary">${activeTestObj ? activeTestObj.cost : '0.00'}</span>
                  </div>
                  
                  {/* Insurance Badge inside Total */}
                  {paymentMethod === 'insurance' && activeTestObj && (
                    <div className="mt-2 text-end">
                      <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                        <FaShieldAlt className="me-1"/> Covered
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTON */}
                <button 
                  onClick={handleBooking} 
                  className="btn btn-dark w-100 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center"
                  disabled={!activeTestObj || !activeSlotObj}
                  style={{ transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Confirm & Pay <FaArrowRight className="ms-2" />
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookTest;