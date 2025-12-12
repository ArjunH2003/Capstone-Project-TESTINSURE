import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaFlask, FaSearch, FaDollarSign, FaTimes, FaStethoscope, FaClipboardList, FaInfoCircle } from 'react-icons/fa';

const AdminTests = () => {
  const [tests, setTests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    cost: '',
    prepInstructions: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await api.get('/tests');
      setTests(response.data);
    } catch (error) {
      toast.error("Failed to load tests.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tests', newTest);
      toast.success("Test Added Successfully!");
      setShowForm(false);
      setNewTest({ name: '', description: '', cost: '', prepInstructions: '' }); 
      fetchTests(); 
    } catch (error) {
      toast.error("Failed to add test.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete this test?")) {
        try {
            await api.delete(`/tests/${id}`);
            toast.success("Test Deleted.");
            fetchTests();
        } catch (error) {
            toast.error("Cannot delete. It might have existing bookings.");
        }
    }
  }

  const filteredTests = tests.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getAvatarColor = (id) => ['bg-primary', 'bg-success', 'bg-warning', 'bg-info', 'bg-danger'][id % 5];

  return (
    <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--bs-body-font-family)' }}>
      <Navbar />
      
      <div className="container py-5">
        
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-dark m-0 d-flex align-items-center">
              <div className="p-2 bg-white rounded-circle shadow-sm me-3 d-flex align-items-center justify-content-center" style={{width:'50px', height:'50px'}}>
                <FaFlask className="text-primary" size={24} />
              </div>
              Diagnostic Catalog
            </h2>
            <p className="text-muted mb-0 ms-1 mt-1">Manage medical tests and pricing inventory.</p>
          </div>
          <button 
            className={`btn rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center ${showForm ? 'btn-white border text-danger bg-white' : 'btn-primary'}`} 
            onClick={() => setShowForm(!showForm)}
            style={{transition: 'all 0.3s ease'}}
          >
            {showForm ? <><FaTimes className="me-2"/> Close Form</> : <><FaPlus className="me-2"/> Add New Test</>}
          </button>
        </div>

        {/* --- ADD TEST FORM (PALE BLUE THEME) --- */}
        {showForm && (
          <div className="card border-0 shadow-lg rounded-4 p-4 mb-5" style={{ backgroundColor: '#eff6ff', borderLeft: '5px solid #2563eb' }}>
            <h5 className="fw-bold text-primary mb-4 pb-2 border-bottom border-primary border-opacity-25">Create New Service</h5>
            
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-primary text-uppercase" style={{fontSize: '0.7rem'}}>Test Name</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-white border-end-0 text-muted border-0"><FaStethoscope /></span>
                    <input type="text" className="form-control bg-white border-0 text-dark fw-medium" placeholder="" value={newTest.name} onChange={(e) => setNewTest({...newTest, name: e.target.value})} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-primary text-uppercase">Cost ($)</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-white border-end-0 text-muted border-0"><FaDollarSign /></span>
                    <input type="number" className="form-control bg-white border-0 text-dark fw-medium" placeholder="" value={newTest.cost} onChange={(e) => setNewTest({...newTest, cost: e.target.value})} required />
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small text-primary text-uppercase">Description</label>
                  <textarea className="form-control bg-white text-dark border-0 shadow-sm" rows="2" placeholder="Details..." value={newTest.description} onChange={(e) => setNewTest({...newTest, description: e.target.value})} required />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small text-primary text-uppercase">Prep Instructions</label>
                  <div className="input-group shadow-sm">
                    <span className="input-group-text bg-white border-end-0 text-muted border-0"><FaClipboardList /></span>
                    <input type="text" className="form-control bg-white border-0 text-dark" placeholder="" value={newTest.prepInstructions} onChange={(e) => setNewTest({...newTest, prepInstructions: e.target.value})} required />
                  </div>
                </div>
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm">Save to Catalog</button>
              </div>
            </form>
          </div>
        )}

        {/* --- TABLE SECTION --- */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <div className="p-4 border-bottom d-flex align-items-center justify-content-between" style={{ backgroundColor: '#ffffff' }}>
            <h5 className="fw-bold m-0 text-dark">Active Services <span className="badge bg-primary bg-opacity-10 text-primary ms-2 rounded-pill">{tests.length}</span></h5>
            <div className="input-group shadow-sm" style={{maxWidth: '300px'}}>
              <span className="input-group-text bg-white border-end-0 ps-3"><FaSearch className="text-muted"/></span>
              <input 
                type="text" 
                className="form-control bg-white border-start-0 ps-2" 
                placeholder="Search catalog..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px', padding: '0 15px' }}>
              <thead className="text-secondary small text-uppercase" style={{ backgroundColor: 'transparent' }}>
                <tr>
                  <th className="py-3 ps-4 border-0">Test Name</th>
                  <th className="py-3 border-0">Description</th>
                  <th className="py-3 border-0">Price</th>
                  <th className="py-3 pe-4 text-end border-0">Action</th>
                </tr>
              </thead>
              
              <tbody style={{ backgroundColor: 'transparent' }}>
                {filteredTests.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">No tests found.</td></tr>
                ) : (
                  filteredTests.map((test) => (
                    <tr key={test.testId} className="shadow-hover-row" 
                        // UPDATED: Stronger Pale Blue (#eef7ff)
                        style={{ backgroundColor: '#eef7ff', transition: 'all 0.2s ease' }}
                    >
                      <td className="ps-4 py-3 border-0 rounded-start-3">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm me-3 ${getAvatarColor(test.testId)}`} 
                               style={{width: '45px', height: '45px', fontSize: '0.9rem', opacity: 0.9}}>
                            {getInitials(test.name)}
                          </div>
                          <div>
                            <span className="fw-bold text-dark d-block fs-6">{test.name}</span>
                            <small className="text-muted fw-bold" style={{fontSize: '0.7rem'}}>ID: #{test.testId}</small>
                          </div>
                        </div>
                      </td>
                      
                      <td className="border-0">
                        <div className="text-secondary small text-truncate" style={{maxWidth: '300px', fontWeight: '500'}}>{test.description}</div>
                        <div className="d-flex align-items-center mt-1">
                          <FaInfoCircle className="text-info me-1" size={12}/>
                          <span className="small text-dark fw-medium">{test.prepInstructions}</span>
                        </div>
                      </td>
                      
                      <td className="border-0">
                        <span className="badge bg-white text-success border border-success border-opacity-25 rounded-pill px-3 py-2 fw-bold shadow-sm">
                          ${test.cost}
                        </span>
                      </td>
                      
                      <td className="text-end pe-4 border-0 rounded-end-3">
                        <button 
                          className="btn btn-white text-danger border border-danger border-opacity-10 shadow-sm btn-sm rounded-circle p-2 hover-scale" 
                          onClick={() => handleDelete(test.testId)}
                          title="Delete Test"
                          style={{width: '38px', height: '38px'}}
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <style>{`
        .shadow-hover-row {
          box-shadow: 0 2px 5px rgba(37, 99, 235, 0.05); 
          border: 1px solid transparent;
        }
        .shadow-hover-row:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15) !important;
          background-color: #ffffff !important; /* Row turns WHITE on hover for contrast */
          z-index: 10;
        }
        .hover-scale:hover {
          transform: scale(1.1);
          background-color: #fee2e2 !important; 
        }
      `}</style>
    </div>
  );
};

export default AdminTests;