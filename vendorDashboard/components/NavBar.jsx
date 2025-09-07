import React, { useState, useEffect } from 'react'

const NavBar = ({showLoginHandler,showRegisterHandler,showLogOut,logOutHandler,firmName}) => {

  return (
    <div className="navSection">

        <div className="company">
            vendor Dashboard
        </div>
        <div className='firmName'>
          {firmName && <h4>Firm Name: {firmName}</h4>}
        </div>
        <div className="userAuth">
          {!showLogOut ?
          <>
          <span onClick={showLoginHandler}>Login/</span>
          <span onClick={showRegisterHandler}>Register</span>
          </> :  <span onClick={logOutHandler}>Logout</span>}
            
           
        </div>
    </div>
  )
}

export default NavBar