import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/ApiPath';

const UserDetails = () => {
  const [vendorData, setVendorData] = useState(null);
  const [firmData, setFirmData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Also check localStorage for firm data as fallback
  useEffect(() => {
    const storedFirmName = localStorage.getItem('firmName');
    const storedFirmId = localStorage.getItem('firmId');
    
    if (storedFirmName && storedFirmId && !firmData) {
      // If we have firm data in localStorage but not in state, try to fetch it
      fetchFirmData(storedFirmId);
    }
  }, []);

  const fetchFirmData = async (firmId) => {
    try {
      const loginToken = localStorage.getItem('loginToken');
      const firmResponse = await fetch(`${API_URL}/firm/single-firm/${firmId}`, {
        headers: {
          'Authorization': `Bearer ${loginToken}`
        }
      });
      
      if (firmResponse.ok) {
        const firmResult = await firmResponse.json();
        console.log("Firm data fetched from localStorage fallback:", firmResult);
        setFirmData(firmResult.firm);
      }
    } catch (error) {
      console.error("Error fetching firm data from localStorage:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const loginToken = localStorage.getItem('loginToken');
      const vendorId = localStorage.getItem('vendorId');
      
      if (!loginToken || !vendorId) {
        setError('Please login to view user details');
        setLoading(false);
        return;
      }

      // Fetch vendor details
      const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
        headers: {
          'Authorization': `Bearer ${loginToken}`
        }
      });

      if (vendorResponse.ok) {
        const vendorResult = await vendorResponse.json();
        console.log("Vendor data received:", vendorResult);
        setVendorData(vendorResult.vendor);
        
        // If vendor has firm data, fetch firm details
        if (vendorResult.vendorFirmId) {
          console.log("Fetching firm data for ID:", vendorResult.vendorFirmId);
          const firmResponse = await fetch(`${API_URL}/firm/single-firm/${vendorResult.vendorFirmId}`, {
            headers: {
              'Authorization': `Bearer ${loginToken}`
            }
          });
          
          if (firmResponse.ok) {
            const firmResult = await firmResponse.json();
            console.log("Firm data received:", firmResult);
            setFirmData(firmResult.firm);
          } else {
            console.error("Failed to fetch firm data:", firmResponse.status);
          }
        } else {
          console.log("No firm ID found for vendor");
        }
      } else {
        console.error("Failed to fetch vendor details:", vendorResponse.status);
        setError('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error loading user details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="userDetailsSection">
        <div className="loadingContainer">
          <h3>Loading user details...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userDetailsSection">
        <div className="errorContainer">
          <h3>Error: {error}</h3>
          <button onClick={fetchUserDetails} className="retryButton">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="userDetailsSection">
      <div className="userDetailsContainer">
        <h2>User Details</h2>
        
        {/* Vendor Information */}
        <div className="detailsCard">
          <h3>Vendor Information</h3>
          <div className="detailsGrid">
            <div className="detailItem">
              <label>Username:</label>
              <span>{vendorData?.username || 'N/A'}</span>
            </div>
            <div className="detailItem">
              <label>Email:</label>
              <span>{vendorData?.email || 'N/A'}</span>
            </div>
            <div className="detailItem">
              <label>Vendor ID:</label>
              <span>{vendorData?._id || 'N/A'}</span>
            </div>
            <div className="detailItem">
              <label>Account Created:</label>
              <span>{formatDate(vendorData?.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Firm Information */}
        {firmData ? (
          <div className="detailsCard">
            <h3>Firm Information</h3>
            <div className="detailsGrid">
              <div className="detailItem">
                <label>Firm Name:</label>
                <span>{firmData.firmName || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <label>Area:</label>
                <span>{firmData.area || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <label>Offer:</label>
                <span>{firmData.offer || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <label>Firm ID:</label>
                <span>{firmData._id || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <label>Categories:</label>
                <span>
                  {firmData.category && firmData.category.length > 0 
                    ? firmData.category.join(', ') 
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="detailItem">
                <label>Regions:</label>
                <span>
                  {firmData.region && firmData.region.length > 0 
                    ? firmData.region.join(', ') 
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="detailItem">
                <label>Firm Created:</label>
                <span>{formatDate(firmData.createdAt)}</span>
              </div>
            </div>
            
            {/* Firm Image */}
            {firmData.image && (
              <div className="imageContainer">
                <label>Firm Image:</label>
                <img 
                  src={`${API_URL}/uploads/${firmData.image}`} 
                  alt="Firm" 
                  className="firmImage"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="detailsCard">
            <h3>Firm Information</h3>
            <div className="noFirmMessage">
              <p>No firm associated with this account.</p>
              <p>Please add a firm to see firm details here.</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="actionButtons">
          <button onClick={fetchUserDetails} className="refreshButton">
            Refresh Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
