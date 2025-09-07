import React,{use, useState} from 'react'
import { API_URL } from '../../data/ApiPath';


export const Login = ({showWelcomeHandler, onFirmDataUpdate}) => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const loginHandler = async(e)=>{
        e.preventDefault();

        try {
            const responce = await fetch(`${API_URL}/vendor/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({email,password})
            });
            const data = await responce.json();
            
            if(responce.ok){
                alert("login success");
                setEmail("");
                setPassword("");
                localStorage.setItem('loginToken',data.token);
                localStorage.setItem('vendorId', data.vendorId);
                
                // Fetch vendor details after successful login
                const vendorId = data.vendorId;
                if(vendorId){
                    const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`);
                    const vendorData = await vendorResponse.json();
                    
                    if(vendorResponse.ok && vendorData.vendor){
                        // Check if vendor has firm data
                        if(vendorData.vendorFirmId && vendorData.vendor.firm && vendorData.vendor.firm.length > 0){
                            const vendorFirmId = vendorData.vendorFirmId;
                            const vendorFirmName = vendorData.vendor.firm[0].firmName;
                            localStorage.setItem('firmId', vendorFirmId);
                            localStorage.setItem('firmName', vendorFirmName);
                            console.log("Firm data loaded:", { vendorFirmId, vendorFirmName });
                            
                            // Notify parent component about firm data
                            if(onFirmDataUpdate) {
                                onFirmDataUpdate(vendorFirmName, vendorFirmId);
                            }
                        } else {
                            console.log("Vendor has no firm associated");
                            // Clear any existing firm data
                            localStorage.removeItem('firmId');
                            localStorage.removeItem('firmName');
                            
                            // Notify parent component about no firm data
                            if(onFirmDataUpdate) {
                                onFirmDataUpdate('', '');
                            }
                        }
                        showWelcomeHandler();
                    } else {
                        console.error("Failed to fetch vendor details:", vendorData);
                        alert("Login successful but failed to load vendor details");
                        showWelcomeHandler();
                    }
                } else {
                    console.error("No vendor ID received from login");
                    alert("Login successful but no vendor ID received");
                    showWelcomeHandler();
                }
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed: " + error.message);
        }
    }
  return (
    <div className="loginSection">
       
        <form className='authForm' onSubmit={loginHandler}>
        <h3>Vendor Login</h3><br/>
            <label>Email</label>
            <input type="text" name='email'value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='enter your email'/><br/>
            <label>Password</label>
            <input type='password' name='password'value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='enter your password'/><br/>
            <div className="btnSubmit">
                <button type='submit'>Submit</button>
            </div>

        </form>
    </div>
  )
}
