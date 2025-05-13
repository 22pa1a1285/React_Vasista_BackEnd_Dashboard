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
  const [showLogin, setshowLogin] = useState(false);
  const [showRegister, setshowRegister] = useState(false);
  const [showFirm, setshowFirm] = useState(false);
  const [showProduct, setshowProduct] = useState(false);
  const [showWelcome, setshowWelcome] = useState(false);
  const [showAllProducts, setshowAllProducts] = useState(false);
  const [showLogOut, setShowLogOut] = useState(false);
  const [showFirmTitle, setShowFirmTitle] = useState(false);

  useEffect(() => {
    const loginToken = localStorage.getItem('loginToken');
    if (loginToken) {
      setShowLogOut(true);
    }
  }, []);

  useEffect(() => {
    const firmName = localStorage.getItem("firmName");
    setShowFirmTitle(!firmName);
  }, []);

  const logOutHandler = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("firmId");
      localStorage.removeItem("firmName");
      setShowLogOut(false);
      setShowFirmTitle(true);
      setshowLogin(false);
      setshowRegister(false);
      setshowFirm(false);
      setshowProduct(false);
      setshowWelcome(false);
      setshowAllProducts(false);
    }
  };

  const showLoginHandler = () => {
    setshowLogin(true);
    setshowRegister(false);
    setshowFirm(false);
    setshowProduct(false);
    setshowWelcome(false);
    setshowAllProducts(false);
  };

  const showRegisterHandler = () => {
    setshowRegister(true);
    setshowLogin(false);
    setshowFirm(false);
    setshowProduct(false);
    setshowWelcome(false);
    setshowAllProducts(false);
  };

  const showFirmHandler = () => {
    if (showLogOut) {
      setshowRegister(false);
      setshowLogin(false);
      setshowFirm(true);
      setshowProduct(false);
      setshowWelcome(false);
      setshowAllProducts(false);
    } else {
      alert("Please Login");
      setshowLogin(true);
    }
  };

  const showProductHandler = () => {
    if (showLogOut) {
      setshowRegister(false);
      setshowLogin(false);
      setshowFirm(false);
      setshowProduct(true);
      setshowWelcome(false);
      setshowAllProducts(false);
    } else {
      alert("Please Login");
      setshowLogin(true);
    }
  };

  const showWelcomeHandler = () => {
    setshowRegister(false);
    setshowLogin(false);
    setshowFirm(false);
    setshowProduct(false);
    setshowWelcome(true);
    setshowAllProducts(false);
  };

  const showAllProductsHandler = () => {
    if (showLogOut) {
      setshowRegister(false);
      setshowLogin(false);
      setshowFirm(false);
      setshowProduct(false);
      setshowWelcome(false);
      setshowAllProducts(true);
    } else {
      alert("Please Login");
      setshowLogin(true);
    }
  };

  return (
    <section className='landingSection'>
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
        {showLogin && <Login showWelcomeHandler={showWelcomeHandler} />}
        {showRegister && <Register showLoginHandler={showLoginHandler} />}
        {showFirm && showLogOut && <AddFirm />}
        {showProduct && showLogOut && <AddProduct />}
        {showWelcome && <Welcome />}
        {showAllProducts && showLogOut && <AllProducts />}
      </div>
    </section>
  );
};

export default LandingPage;
