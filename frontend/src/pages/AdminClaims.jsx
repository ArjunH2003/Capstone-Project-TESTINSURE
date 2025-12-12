import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

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
      toast.success("Claim Approved!");
      fetchClaims(); // Refresh list to see updated status
    } catch (error) {
      toast.error("Approval Failed.");
    }
  };

 // 3. Reject Logic with Reason (JSON Version)
  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason (Type 'Invalid Insurance' to block policy):");
    if (reason === null) return; // User clicked Cancel

    try {
      // Send JSON object: { "reason": "..." }
      // Axios automatically sets Content-Type to application/json
      await api.put(`/insurance/claims/${id}/reject`, { reason: reason });
      
      toast.error("Claim Rejected.");
      fetchClaims();
    } catch (error) {
      toast.error("Rejection Failed.");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Insurance Claims Management</h2>
        <p>Review pending insurance claims from patients.</p>

        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Policy Details</th>
                <th>Test / Cost</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No claims found.</td></tr>
              ) : (
                claims.map(claim => (
                  <tr key={claim.claimId}>
                    <td>{claim.claimId}</td>
                    <td>
                      <strong>{claim.booking.user.name}</strong> <br/>
                      <small className="text-muted">{claim.booking.user.email}</small>
                    </td>
                    <td>
                      {claim.policy.providerName} <br/>
                      <small>#{claim.policy.policyNumber}</small>
                    </td>
                    <td>
                      {claim.booking.laboratoryTest.name} <br/>
                      <strong>${claim.booking.laboratoryTest.cost}</strong>
                    </td>
                    <td>
                      {/* Status Badges */}
                      {claim.status === 'PENDING' && <span className="badge bg-warning text-dark">PENDING</span>}
                      {claim.status === 'APPROVED' && <span className="badge bg-success">APPROVED (${claim.approvedAmount})</span>}
                      {claim.status === 'REJECTED' && <span className="badge bg-danger">REJECTED</span>}
                    </td>
                    <td>
                      {claim.status === 'PENDING' ? (
                        <div className="d-flex gap-2">
                          <button className="btn btn-success btn-sm" onClick={() => handleApprove(claim.claimId)}>
                            Approve
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleReject(claim.claimId)}>
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminClaims;