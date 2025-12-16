import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  FaFileUpload, 
  FaSearch, 
  FaUserInjured, 
  FaFileMedicalAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaCloudUploadAlt, 
  FaFlask, 
  FaSpinner 
} from 'react-icons/fa';

const AdminReports = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Upload State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/all');
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to load bookings.");
    }
  };

  // --- HANDLERS ---
  const openUploadModal = (booking) => {
    setCurrentBooking(booking);
    setSelectedFile(null); // Reset file
    setIsModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsModalOpen(false);
    setCurrentBooking(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentBooking) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('bookingId', currentBooking.bookingId);
    formData.append('file', selectedFile);

    setUploading(true);

    try {
      await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Report for ${currentBooking.user.name} uploaded!`);
      closeUploadModal();
      // Optional: Refresh bookings if you track 'reportUploaded' status
      // fetchBookings(); 
    } catch (error) {
      toast.error("Upload Failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // --- SEARCH FILTER ---
  const filteredBookings = bookings.filter(b => 
    b.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingId.toString().includes(searchTerm) ||
    b.laboratoryTest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* HEADER */}
      <div className="bg-white border-bottom shadow-sm py-4 mb-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="bg-indigo bg-opacity-10 p-3 rounded-3 text-indigo me-3" style={{backgroundColor: '#e0e7ff', color: '#4338ca'}}>
                <FaFileMedicalAlt size={24} />
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">Diagnostic Reports Center</h3>
                <p className="text-secondary mb-0">Upload and manage patient test results.</p>
              </div>
            </div>
            
            {/* SEARCH BAR */}
            <div className="position-relative d-none d-md-block" style={{ width: '300px' }}>
                <FaSearch className="position-absolute text-muted" style={{ top: '12px', left: '15px' }} />
                <input 
                    type="text" 
                    className="form-control ps-5 rounded-pill border-light bg-light fw-medium"
                    placeholder="Search patient, ID, or test..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        
        {/* TABLE CARD */}
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-header bg-white pt-4 px-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
             <h6 className="fw-bold text-dark m-0 fs-5">Pending Reports Queue</h6>
             <span className="badge bg-indigo text-white px-3 py-2 rounded-pill" style={{backgroundColor: '#4338ca'}}>
                {filteredBookings.length} Records
             </span>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3 text-secondary text-uppercase fw-bold text-xs">Booking ID</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold text-xs">Patient Details</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold text-xs">Test Type</th>
                    <th className="py-3 text-secondary text-uppercase fw-bold text-xs">Payment Status</th>
                    <th className="text-end pe-4 py-3 text-secondary text-uppercase fw-bold text-xs">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredBookings.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="text-center py-5">
                            <div className="text-muted opacity-50 mb-2"><FaSearch size={30}/></div>
                            <p className="text-muted fw-medium">No bookings found matching your search.</p>
                        </td>
                    </tr>
                  ) : (
                    filteredBookings.map(b => (
                      <tr key={b.bookingId} className="border-bottom hover-row">
                        
                        {/* ID */}
                        <td className="ps-4">
                            <span className="font-monospace fw-bold text-dark bg-light px-2 py-1 rounded border">#{b.bookingId}</span>
                        </td>

                        {/* PATIENT */}
                        <td>
                            <div className="d-flex align-items-center">
                                <div className="avatar me-3 text-indigo fw-bold" style={{backgroundColor: '#e0e7ff', color: '#4338ca'}}>
                                    {b.user.name.charAt(0)}
                                </div>
                                <div>
                                    <span className="d-block fw-bold text-dark">{b.user.name}</span>
                                    <span className="text-muted text-xs">{b.user.email}</span>
                                </div>
                            </div>
                        </td>

                        {/* TEST */}
                        <td>
                            <div className="d-flex align-items-center text-dark fw-medium">
                                <FaFlask className="me-2 text-secondary opacity-50"/> {b.laboratoryTest.name}
                            </div>
                        </td>

                        {/* PAYMENT STATUS */}
                        <td>
                            {b.paymentStatus === 'PAID' ? (
                                <span className="status-pill status-success">
                                    <FaCheckCircle className="me-1"/> Paid
                                </span>
                            ) : (
                                <span className="status-pill status-warning">
                                    <FaTimesCircle className="me-1"/> {b.paymentStatus}
                                </span>
                            )}
                        </td>

                        {/* ACTION BUTTON */}
                        <td className="text-end pe-4">
                            <button 
                                className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm fw-bold d-flex align-items-center ms-auto hover-lift"
                                onClick={() => openUploadModal(b)}
                                style={{backgroundColor: '#4338ca', borderColor: '#4338ca'}}
                            >
                                <FaCloudUploadAlt className="me-2"/> Upload
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
      </div>

      {/* --- UPLOAD MODAL OVERLAY --- */}
      {isModalOpen && currentBooking && (
        <div className="modal-backdrop-custom">
            <div className="modal-content-custom shadow-lg rounded-4 overflow-hidden">
                {/* Modal Header */}
                <div className="bg-light px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0 text-dark">Upload Diagnostic Report</h5>
                    <button onClick={closeUploadModal} className="btn-close small"></button>
                </div>

                {/* Modal Body */}
                <div className="p-4">
                    {/* Patient Summary */}
                    <div className="d-flex align-items-center mb-4 bg-indigo bg-opacity-10 p-3 rounded-3 border" style={{backgroundColor: '#f5f3ff', borderColor: '#ddd6fe'}}>
                        <FaUserInjured size={24} className="text-primary me-3" style={{color: '#7c3aed'}}/>
                        <div>
                            <p className="mb-0 text-xs text-uppercase fw-bold text-muted">Uploading for</p>
                            <h6 className="fw-bold text-dark m-0">{currentBooking.user.name} <span className="fw-normal text-muted">({currentBooking.laboratoryTest.name})</span></h6>
                        </div>
                    </div>

                    {/* File Drop Area (Simulated) */}
                    <label className="upload-area mb-4 d-block cursor-pointer">
                        <input type="file" onChange={handleFileChange} hidden accept=".pdf,.jpg,.png,.jpeg" />
                        <div className="text-center p-5 border-2 border-dashed rounded-3" style={{borderColor: selectedFile ? '#10b981' : '#cbd5e1', backgroundColor: selectedFile ? '#ecfdf5' : '#fff'}}>
                            {selectedFile ? (
                                <>
                                    <FaCheckCircle size={40} className="text-success mb-3"/>
                                    <h6 className="fw-bold text-dark">{selectedFile.name}</h6>
                                    <p className="text-success small mb-0">File ready to upload</p>
                                </>
                            ) : (
                                <>
                                    <FaFileUpload size={40} className="text-secondary opacity-25 mb-3"/>
                                    <h6 className="fw-bold text-dark">Click to select file</h6>
                                    <p className="text-muted small mb-0">PDF, JPG, or PNG (Max 5MB)</p>
                                </>
                            )}
                        </div>
                    </label>

                    {/* Actions */}
                    <div className="d-grid gap-2">
                        <button 
                            className="btn btn-primary py-3 fw-bold shadow-sm" 
                            onClick={handleUpload} 
                            disabled={!selectedFile || uploading}
                            style={{backgroundColor: '#4338ca', borderColor: '#4338ca'}}
                        >
                            {uploading ? (
                                <><FaSpinner className="spinner-rotate me-2"/> Uploading Report...</>
                            ) : (
                                "Confirm & Upload"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .text-xs { font-size: 0.75rem; letter-spacing: 0.5px; }
        
        .avatar { width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
        
        .status-pill { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 600; }
        .status-success { background-color: #ecfdf5; color: #059669; }
        .status-warning { background-color: #fffbeb; color: #d97706; }
        
        .hover-row:hover { background-color: #f8fafc; transition: background 0.2s; }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s; }
        
        .spinner-rotate { animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Modal Styles */
        .modal-backdrop-custom {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
            display: flex; align-items: center; justify-content: center; z-index: 1050;
            animation: fadeIn 0.2s ease-out;
        }
        .modal-content-custom {
            background: white; width: 90%; max-width: 450px;
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .upload-area:hover .border-dashed { border-color: #4338ca !important; background-color: #f5f3ff !important; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default AdminReports;