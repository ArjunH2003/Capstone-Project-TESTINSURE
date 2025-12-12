import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaPlus, FaUsers, FaCalendarDay } from 'react-icons/fa';

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
    try {
      const slotData = { ...newSlot, startTime: newSlot.startTime + ":00", endTime: newSlot.endTime + ":00" };
      await api.post(`/slots?testId=${selectedTestId}`, slotData);
      toast.success("Slot Created!");
      fetchSlots(selectedTestId);
      setNewSlot({ ...newSlot, startTime: '', endTime: '' });
    } catch (error) { toast.error("Failed to create slot."); }
  };

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--bs-body-font-family)' }}>
      <Navbar />
      <div className="container py-5">
        
        {/* HEADER */}
        <div className="mb-5">
          <h2 className="fw-bold text-dark m-0 d-flex align-items-center">
            <FaClock className="me-3 text-success opacity-75" /> Schedule Management
          </h2>
          <p className="text-muted mb-0 ms-1">Define capacity and timing for diagnostic services.</p>
        </div>

        {/* SELECT TEST DROPDOWN CARD */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
          <label className="fw-bold text-uppercase small text-secondary mb-2">Step 1: Select Diagnostic Service</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-0"><FaStethoscope className="text-muted"/></span>
            <select className="form-select bg-light border-0 py-2 fw-medium" value={selectedTestId} onChange={(e) => setSelectedTestId(e.target.value)}>
              <option value="">-- Choose a Test --</option>
              {tests.map(test => <option key={test.testId} value={test.testId}>{test.name}</option>)}
            </select>
          </div>
        </div>

        {selectedTestId && (
          <div className="row g-4">
            
            {/* --- LEFT: SLOTS TABLE (BLUISH) --- */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white h-100">
                <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold m-0 text-dark">Active Slots</h6>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill">{slots.length} Slots</span>
                </div>
                
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead style={{ backgroundColor: '#f0fdf4' }}> {/* Pale Green for Slots to diff from Tests */}
                      <tr style={{ borderBottom: '2px solid #bbf7d0' }}>
                        <th className="ps-4 py-3 text-success small text-uppercase fw-bold">Date</th>
                        <th className="py-3 text-success small text-uppercase fw-bold">Timing</th>
                        <th className="py-3 text-end pe-4 text-success small text-uppercase fw-bold">Availability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.length === 0 ? (
                        <tr><td colSpan="3" className="text-center py-5 text-muted">No slots scheduled yet.</td></tr>
                      ) : (
                        slots.map(slot => (
                          <tr key={slot.slotId} style={{ borderBottom: '1px solid #f1f5f9' }} className="hover-bg-green">
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded p-2 text-center me-3 border" style={{width: '50px'}}>
                                  <div className="fw-bold text-dark">{slot.date.split('-')[2]}</div>
                                  <div className="small text-uppercase text-muted" style={{fontSize: '9px'}}>{new Date(slot.date).toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <span className="fw-medium text-dark">{slot.date}</span>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-white border border-secondary border-opacity-25 text-dark fw-normal rounded-1 px-2">
                                {slot.startTime.substring(0,5)} - {slot.endTime.substring(0,5)}
                              </span>
                            </td>
                            <td className="text-end pe-4">
                              <div className="d-inline-flex align-items-center bg-success bg-opacity-10 text-success px-3 py-1 rounded-pill small fw-bold border border-success border-opacity-25">
                                <FaUsers className="me-2"/> {slot.capacity} Spots
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* --- RIGHT: ADD SLOT FORM --- */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white" style={{borderTop: '4px solid #10b981'}}>
                <h5 className="fw-bold text-dark mb-4">Add New Slot</h5>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-muted">Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><FaCalendarDay className="text-muted"/></span>
                      <input type="date" className="form-control bg-light border-0" value={newSlot.date} onChange={(e) => setNewSlot({...newSlot, date: e.target.value})} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label fw-bold small text-muted">Start</label>
                      <input type="time" className="form-control bg-light border-0" value={newSlot.startTime} onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold small text-muted">End</label>
                      <input type="time" className="form-control bg-light border-0" value={newSlot.endTime} onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})} required />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-bold small text-muted">Total Capacity</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0"><FaUsers className="text-muted"/></span>
                      <input type="number" className="form-control bg-light border-0" value={newSlot.capacity} onChange={(e) => setNewSlot({...newSlot, capacity: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success w-100 rounded-pill fw-bold shadow-sm">
                    <FaPlus className="me-2" /> Add to Schedule
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}
      </div>
      
      {/* Import Icon for Select (Optional fix if missing) */}
      {/* Custom CSS for Hover */}
      <style>{`
        .hover-bg-green:hover { background-color: #f0fdf4 !important; }
      `}</style>
    </div>
  );
};

// Simple Icon Import (Helper)
const FaStethoscope = (props) => <svg {...props} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M166.3 352c-15 0-29.3-4.1-41.9-11.3-15.7-9-27.1-23.7-32.1-41.4-12.6-44.6 12.6-89.9 56-103.5l141.6-43.2c36-11 74.3 9.7 85.3 45.7 11.1 36.3-9.7 74.5-46 85.6L187.7 327c-6.8 2-13.9 3-21.4 3zm139.7-177.6L164.4 217.6c-27.8 8.6-43.7 37.1-35.6 65.4 3.1 10.9 9.9 20 19.3 25.4 29.3 16.9 66.7 6.8 83.6-22.3l141.6-43.2c22.7-6.9 35.7-30.8 28.7-53.5-6.9-22.7-30.7-35.8-53.4-28.8l-2.6.8z"></path><path d="M166.3 384c-17.6 0-31.9-14.3-31.9-31.9V160c0-17.6 14.3-31.9 31.9-31.9h272c17.6 0 31.9-14.3 31.9-31.9V64c0-17.6-14.3-31.9-31.9-31.9H112C50.2 32 0 82.2 0 144v272c0 17.6 14.3 31.9 31.9 31.9h22.3l29.9 29.9c6.2 6.2 16.4 6.2 22.6 0l29.9-29.9h29.7z"></path></svg>;

export default AdminSlots;