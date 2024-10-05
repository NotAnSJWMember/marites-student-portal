import React from "react";
import { EyeOutline, EyeOffOutline, LogoGoogle } from "react-ionicons";
import logoIcon from "../assets/images/logo.png";
import "./Login.scss";

const Login = () => {
   return (
      <main>
         <div className="container">
            <div className="seal-container">
               <img src={logoIcon} alt="Marites University Seal" />
            </div>
            <div className="head">
               <h1 className="title">Student Portal</h1>
               <p>Sign in to start your session</p>
            </div>
            <form>
               <label htmlFor="username">Username</label>
               <input type="text" autoComplete="false" />
               <label htmlFor="password">Password</label>
               <div className="input-merge">
                  <input type="password" autoComplete="false" />
                  <span className="input-icon">
                     <EyeOutline color="gray" height="20px" width="20px" />
                  </span>
               </div>
               <a className="cta-forgot">Forgot your password?</a>
               <button className="login-btn">Sign In</button>
               <div className="text-divider">
                  <span>OR</span>
                  <div className="line"></div>
               </div>
               <button className="google-btn">
                  <LogoGoogle color="white"/>
                  Sign in via Student Email
               </button>
            </form>
         </div>
      </main>
   );
};

export default Login;
