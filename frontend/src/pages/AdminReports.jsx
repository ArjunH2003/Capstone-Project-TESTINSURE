import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminReports = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null); // Which booking is currently being uploaded

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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (bookingId) => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('bookingId', bookingId);
    formData.append('file', selectedFile);

    setUploadingId(bookingId); // Show spinner/text for this button

    try {
      await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Crucial for file uploads
        },
      });
      toast.success("Report Uploaded Successfully!");
      setSelectedFile(null); // Reset file input
    } catch (error) {
      toast.error("Upload Failed.");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Upload Diagnostic Reports</h2>
        <p>Attach PDF/Image results to completed bookings.</p>

        <div className="table-responsive">
          <table className="table table-bordered table-striped shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>Patient</th>
                <th>Test</th>
                <th>Status</th>
                <th>Upload Report</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.bookingId}>
                  <td>{b.bookingId}</td>
                  <td>
                    <strong>{b.user.name}</strong> <br/>
                    <small>{b.user.email}</small>
                  </td>
                  <td>{b.laboratoryTest.name}</td>
                  <td>
                    <span className={`badge ${b.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      Payment: {b.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <input 
                        type="file" 
                        className="form-control form-control-sm"
                        onChange={handleFileChange}
                      />
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleUpload(b.bookingId)}
                        disabled={uploadingId === b.bookingId}
                      >
                        {uploadingId === b.bookingId ? 'Uploading...' : 'Upload'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminReports;