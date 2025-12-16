import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaPlus, FaUsers, FaLayerGroup, FaArrowRight, FaMinus, FaCheckCircle } from 'react-icons/fa';

// --- HELPER: Capacity Control (Fixed Logic + Hidden Spinners) ---
const CapacityControl = ({ capacity, setCapacity }) => {
    // FIX: Use the 'capacity' prop directly to calculate the new value
    // This ensures the parent state gets a number, not a function
    const handleIncrement = () => {
        if (capacity < 100) setCapacity(capacity + 1);
    };

    const handleDecrement = () => {
        if (capacity > 1) setCapacity(capacity - 1);
    };

    return (
        <div className="d-flex align-items-center bg-white rounded-pill p-1 border shadow-sm">
            {/* MINUS BUTTON */}
            <button type="button" className="btn btn-light rounded-circle text-success fw-bold d-flex align-items-center justify-content-center" 
                    style={{width: '32px', height: '32px', padding: 0}} 
                    onClick={handleDecrement} disabled={capacity <= 1}>
                <FaMinus size={10} />
            </button>
            
            {/* INPUT (Spinners hidden via CSS below) */}
            <input 
                type="number" 
                className="form-control border-0 bg-transparent text-center fw-bold text-dark mx-2 no-spinners" 
                style={{width: '50px'}}
                value={capacity} 
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= 100) setCapacity(val);
                    else if (e.target.value === '') setCapacity(''); // Allow clearing while typing
                }}
                onBlur={(e) => {
                    if (!e.target.value) setCapacity(10); // Reset to default if left empty
                }}
                min="1" max="100" required
            />
            
            {/* PLUS BUTTON */}
            <button type="button" className="btn btn-light rounded-circle text-success fw-bold d-flex align-items-center justify-content-center" 
                    style={{width: '32px', height: '32px', padding: 0}}
                    onClick={handleIncrement} disabled={capacity >= 100}>
                <FaPlus size={10} />
            </button>
        </div>
    );
};

const AdminSlots = () => {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [slots, setSlots] = useState([]);

  // Form Data
  const [newSlot, setNewSlot] = useState({ date: '', startTime: '', endTime: '', capacity: 10 });

  useEffect(() => { fetchTests(); }, []);
  useEffect(() => { if (selectedTestId) fetchSlots(selectedTestId); else setSlots([]); }, [selectedTestId]);

  const fetchTests = async () => { try { const res = await api.get('/tests'); setTests(res.data); } catch (err) { toast.error("Error loading tests"); } };
  const fetchSlots = async (testId) => { try { const res = await api.get(`/tests/${testId}/slots`); setSlots(res.data); } catch (err) { toast.error("Error loading slots"); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTestId) { toast.error("Select a test first!"); return; }
    if (newSlot.startTime >= newSlot.endTime) { toast.error("End time must be after start time."); return; }

    try {
      const slotData = { 
        ...newSlot, 
        capacity: parseInt(newSlot.capacity) || 10, 
        startTime: newSlot.startTime + ":00", 
        endTime: newSlot.endTime + ":00" 
      };
      await api.post(`/slots?testId=${selectedTestId}`, slotData);
      toast.success("Slot Created Successfully");
      fetchSlots(selectedTestId);
      setNewSlot({ ...newSlot, startTime: '', endTime: '', date: '' }); 
    } catch (error) { toast.error("Failed to create slot."); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ backgroundColor: '#f0fdf4', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}> 
      <Navbar />
      
      {/* PAGE HEADER */}
      <div className="bg-white border-bottom py-4 mb-4">
        <div className="container">
            <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 text-success me-3">
                    <FaCalendarAlt size={24} />
                </div>
                <div>
                    <h4 className="fw-bold text-dark mb-1">Schedule Management</h4>
                    <p className="text-secondary mb-0 small">Manage capacity and time slots for your diagnostic center.</p>
                </div>
            </div>
        </div>
      </div>

      <div className="container pb-5">
        
        {/* SELECTION CARD */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
            <div className="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3 bg-white">
                <div>
                    <h6 className="fw-bold text-dark mb-1">Select Diagnostic Service</h6>
                    <p className="text-muted small mb-0">Choose a test to view or add schedule slots.</p>
                </div>
                <div className="position-relative" style={{ minWidth: '300px' }}>
                    <FaLayerGroup className="position-absolute text-success opacity-50" style={{ top: '12px', left: '15px' }} />
                    <select 
                        className="form-select border-success border-opacity-25 bg-light fw-bold py-2 ps-5 rounded-pill shadow-sm text-dark"
                        value={selectedTestId} 
                        onChange={(e) => setSelectedTestId(e.target.value)}
                        style={{ cursor: 'pointer' }}
                    >
                        <option value="">-- Select a Test --</option>
                        {tests.map(test => <option key={test.testId} value={test.testId}>{test.name}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {selectedTestId && (
          <div className="row g-4">
            
            {/* --- LEFT: SLOTS LIST --- */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white border-bottom-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold text-dark m-0">Active Slots</h5>
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                        {slots.length} Slots Active
                    </span>
                </div>
                
                <div className="card-body p-0 mt-3">
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                            <th className="ps-4 py-3 text-success small text-uppercase fw-bold border-0">Date</th>
                            <th className="py-3 text-success small text-uppercase fw-bold border-0">Time Window</th>
                            <th className="py-3 text-success small text-uppercase fw-bold border-0">Capacity</th>
                            <th className="text-end pe-4 py-3 text-success small text-uppercase fw-bold border-0">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-5 text-muted">No slots available. Add one to get started.</td></tr>
                        ) : (
                            slots.map(slot => {
                                const booked = 0; 
                                const percent = (booked / slot.capacity) * 100;
                                return (
                                <tr key={slot.slotId} style={{cursor: 'default'}}>
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded p-2 bg-success bg-opacity-10 text-center me-3 border border-success border-opacity-10" style={{minWidth: '45px'}}>
                                                <span className="d-block fw-bold text-success lh-1">{slot.date.split('-')[2]}</span>
                                                <small className="d-block text-success opacity-75" style={{fontSize: '10px'}}>
                                                    {new Date(slot.date).toLocaleString('default', { month: 'short' })}
                                                </small>
                                            </div>
                                            <span className="fw-medium text-dark">{formatDate(slot.date)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center text-dark">
                                            <FaClock className="text-muted me-2 small"/>
                                            {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}
                                        </div>
                                    </td>
                                    <td style={{minWidth: '140px'}}>
                                        <div className="d-flex align-items-center">
                                            <div className="progress flex-grow-1 me-2" style={{height: '6px', backgroundColor: '#e2e8f0'}}>
                                                <div className="progress-bar bg-success" style={{width: `${percent}%`}}></div>
                                            </div>
                                            <small className="text-muted fw-bold">{slot.capacity}</small>
                                        </div>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="d-inline-flex align-items-center gap-1 text-success small fw-bold">
                                            <FaCheckCircle /> Active
                                        </div>
                                    </td>
                                </tr>
                                )
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT: CREATE FORM --- */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden position-sticky" style={{top: '100px'}}>
                {/* GREEN GRADIENT HEADER */}
                <div className="p-4 text-white" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
                    <h5 className="fw-bold mb-1">Add New Slot</h5>
                    <p className="small opacity-75 mb-0">Define timing and capacity.</p>
                </div>
                <div className="card-body p-4 bg-white">
                  <form onSubmit={handleSubmit}>
                    
                    <div className="form-floating mb-3">
                        <input type="date" className="form-control" id="slotDate" placeholder="Date"
                            value={newSlot.date} onChange={(e) => setNewSlot({...newSlot, date: e.target.value})} required />
                        <label htmlFor="slotDate" className="text-muted">Slot Date</label>
                    </div>

                    <div className="row g-2 mb-3">
                        <div className="col-6">
                            <div className="form-floating">
                                <input type="time" className="form-control" id="startTime" 
                                    value={newSlot.startTime} onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})} required />
                                <label htmlFor="startTime" className="text-muted">Start</label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating">
                                <input type="time" className="form-control" id="endTime" 
                                    value={newSlot.endTime} onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})} required />
                                <label htmlFor="endTime" className="text-muted">End</label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="small text-uppercase fw-bold text-muted mb-2 d-block">Slot Capacity</label>
                        <div className="d-flex justify-content-between align-items-center bg-light rounded-3 p-3 border">
                            <div className="d-flex align-items-center text-muted">
                                <FaUsers className="me-2 text-success" />
                                <span className="small">Max Patients</span>
                            </div>
                            <CapacityControl capacity={newSlot.capacity} setCapacity={(val) => setNewSlot({...newSlot, capacity: val})} />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-3 rounded-3 fw-bold shadow-sm hover-lift transition-all">
                        Create Schedule <FaArrowRight className="ms-2 small" />
                    </button>

                  </form>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Styles for Hide Spinners and Hover */}
      <style>{`
        /* Hide Default HTML Spinners */
        .no-spinners::-webkit-inner-spin-button, 
        .no-spinners::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinners {
          -moz-appearance: textfield;
        }

        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2) !important; }
        .transition-all { transition: all 0.3s ease; }
        .btn-light:hover { background: #dcfce7; }
        
        .table-responsive::-webkit-scrollbar { height: 6px; }
        .table-responsive::-webkit-scrollbar-thumb { background: #86efac; border-radius: 3px; }
      `}</style>
    </div>
  );
};

export default AdminSlots;