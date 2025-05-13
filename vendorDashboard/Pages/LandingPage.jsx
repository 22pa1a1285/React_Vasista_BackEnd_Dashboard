import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import { Login } from '../components/forms/Login';
import { Register } from '../components/forms/Register';
import AddFirm from '../components/forms/AddFirm';
import AddProduct from '../components/forms/AddProduct';
import Welcome from '../components/Welcome';
import AllProducts from '../components/AllProducts';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFirm, setShowFirm] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [showFirmTitle, setShowFirmTitle] = useState(false);

  // Helper to check login status from localStorage
  const checkLoginStatus = () => {
    const token = localStorage.getItem('loginToken');
    setShowLogOut(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
    const firmName = localStorage.getItem("firmName");
    setShowFirmTitle(!firmName);
  }, []);

  const logOutHandler = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("firmId");
      localStorage.removeItem("firmName");
      setShowLogOut(false);
      setShowFirmTitle(true);
      setShowWelcome(false);
      setShowFirm(false);
      setShowProduct(false);
      setShowAllProducts(false);
    }
  };

  const showLoginHandler = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setShowAllProducts(false);
  };

  const showRegisterHandler = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setShowAllProducts(false);
  };

  const showFirmHandler = () => {
    if (showLogOut) {
      setShowRegister(false);
      setShowLogin(false);
      setShowFirm(true);
      setShowProduct(false);
      setShowWelcome(false);
      setShowAllProducts(false);
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showProductHandler = () => {
    if (showLogOut) {
      setShowRegister(false);
      setShowLogin(false);
      setShowFirm(false);
      setShowProduct(true);
      setShowWelcome(false);
      setShowAllProducts(false);
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  const showWelcomeHandler = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(true);
    setShowAllProducts(false);
  };

  const showAllProductsHandler = () => {
    if (showLogOut) {
      setShowRegister(false);
      setShowLogin(false);
      setShowFirm(false);
      setShowProduct(false);
      setShowWelcome(false);
      setShowAllProducts(true);
    } else {
      alert("Please login");
      setShowLogin(true);
    }
  };

  return (
    <section className="landingSection">
      <NavBar
        showLoginHandler={showLoginHandler}
        showRegisterHandler={showRegisterHandler}
        showLogOut={showLogOut}
        logOutHandler={logOutHandler}
      />
      <div className="collectionSection">
        <SideBar
          showFirmHandler={showFirmHandler}
          showProductHandler={showProductHandler}
          showAllProductsHandler={showAllProductsHandler}
          showFirmTitle={showFirmTitle}
        />
        {showLogin && (
          <Login
            showWelcomeHandler={showWelcomeHandler}
            checkLoginStatus={checkLoginStatus}
          />
        )}
        {showRegister && (
          <Register showLoginHandler={showLoginHandler} />
        )}
        {showFirm && showLogOut && <AddFirm />}
        {showProduct && showLogOut && <AddProduct />}
        {showWelcome && <Welcome />}
        {showAllProducts && showLogOut && <AllProducts />}
      </div>
    </section>
  );
};

export default LandingPage;
