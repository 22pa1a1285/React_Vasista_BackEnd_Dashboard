import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { Login } from '../components/forms/Login';
import { Register } from '../components/forms/Register';
import AddFirm from '../components/forms/AddFirm';
import AddProduct from '../components/forms/AddProduct';
import Welcome from '../components/Welcome';
import AllProducts from '../components/AllProducts';
import UserDetails from '../components/UserDetails';
import { API_URL } from '../data/ApiPath';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [showFirmTitle, setShowFirmTitle] = useState(false);
  const [firmName, setFirmName] = useState('');

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginToken = localStorage.getItem('loginToken');
      setShowLogOut(!!loginToken);
    };
    
    checkLoginStatus();
    
    // Check login status when localStorage changes
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const checkFirmStatus = async () => {
      const storedFirmName = localStorage.getItem("firmName");
      const storedFirmId = localStorage.getItem("firmId");
      const loginToken = localStorage.getItem("loginToken");
      const vendorId = localStorage.getItem("vendorId");
      
      setFirmName(storedFirmName || '');
      
      // If we have a token and vendorId but no firm data, try to fetch it
      if (loginToken && vendorId && !storedFirmName && !storedFirmId) {
        try {
          const response = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
            headers: {
              'Authorization': `Bearer ${loginToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.vendorFirmId && data.vendor.firm && data.vendor.firm.length > 0) {
              const firmName = data.vendor.firm[0].firmName;
              localStorage.setItem('firmId', data.vendorFirmId);
              localStorage.setItem('firmName', firmName);
              setFirmName(firmName);
            }
          }
        } catch (error) {
          console.error("Error fetching firm status:", error);
        }
      }
      
      // Show Add Firm only if no firm name AND no firm ID
      const currentFirmName = localStorage.getItem("firmName");
      const currentFirmId = localStorage.getItem("firmId");
      setShowFirmTitle(!currentFirmName && !currentFirmId);
    };
    
    checkFirmStatus();
    
    // Check firm status when localStorage changes
    window.addEventListener('storage', checkFirmStatus);
    
    return () => {
      window.removeEventListener('storage', checkFirmStatus);
    };
  }, []);

  const clearAllViews = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setShowAllProducts(false);
    setShowUserDetails(false);
  };

  const logOutHandler = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("vendorId");
      localStorage.removeItem("firmId");
      localStorage.removeItem("firmName");
      setShowLogOut(false);
      setShowFirmTitle(true);
      setFirmName('');
      clearAllViews();
    }
  };

  const requireLogin = (callback) => {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      setShowLogOut(true);
      callback();
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showLoginHandler = () => {
    clearAllViews();
    setShowLogin(true);
  };

  const showRegisterHandler = () => {
    clearAllViews();
    setShowRegister(true);
  };

  const showFirmHandler = () => {
    requireLogin(() => {
      clearAllViews();
      setShowFirm(true);
    });
  };

  const showProductHandler = () => {
    requireLogin(() => {
      clearAllViews();
      setShowProduct(true);
    });
  };

  const showWelcomeHandler = () => {
    clearAllViews();
    setShowWelcome(true);
    setShowLogOut(true); // Set login state to true after successful login
  };

  const showAllProductsHandler = () => {
    requireLogin(() => {
      clearAllViews();
      setShowAllProducts(true);
    });
  };

  const showUserDetailsHandler = () => {
    requireLogin(() => {
      clearAllViews();
      setShowUserDetails(true);
    });
  };

  return (
    <section className='landingSection'>
      <NavBar
        showLoginHandler={showLoginHandler}
        showRegisterHandler={showRegisterHandler}
        showLogOut={showLogOut}
        logOutHandler={logOutHandler}
        firmName={firmName}
      />
      <div className="collectionSection">
        <SideBar
          showFirmHandler={showFirmHandler}
          showProductHandler={showProductHandler}
          showAllProductsHandler={showAllProductsHandler}
          showUserDetailsHandler={showUserDetailsHandler}
          showFirmTitle={showFirmTitle}
        />
        {showLogin && <Login showWelcomeHandler={showWelcomeHandler} onFirmResolved={(name, id) => {
          setFirmName(name || '');
          setShowFirmTitle(!(name && id));
        }} />}
        {showRegister && <Register showLoginHandler={showLoginHandler} />}
        {showFirm && <AddFirm onFirmAdded={() => {
          const storedFirmName = localStorage.getItem("firmName");
          const storedFirmId = localStorage.getItem("firmId");
          setFirmName(storedFirmName || '');
          setShowFirmTitle(!storedFirmName && !storedFirmId);
        }} />}
        {showProduct && <AddProduct />}
        {showWelcome && <Welcome />}
        {showAllProducts && <AllProducts />}
        {showUserDetails && <UserDetails />}
      </div>
    </section>
  );
};

export default LandingPage;
