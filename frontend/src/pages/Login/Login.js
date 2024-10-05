import React from "react";
import { EyeOutline, LogoGoogle } from "react-ionicons";
import logoIcon from "../../assets/images/logo.png";
import styles from "./Login.module.scss";

const Login = () => {
   return (
      <div className={styles.formContainer}>
         <div className={styles.container}>
            <div className={styles.sealContainer}>
               <img src={logoIcon} alt="Marites University Seal" />
            </div>
            <div className={styles.head}>
               <h1 className={styles.head}>Student Portal</h1>
               <p>Sign in to start your session</p>
            </div>
            <form>
               <label htmlFor="username">Username</label>
               <input type="text" autoComplete="false" />
               <label htmlFor="password">Password</label>
               <div className={styles.inputMerge}>
                  <input type="password" autoComplete="false" />
                  <span className={styles.inputIcon}>
                     <EyeOutline color="gray" height="20px" width="20px" />
                  </span>
               </div>
               <a href="forgot.html" className={styles.ctaForgot}>
                  Forgot your password?
               </a>
               <button className={styles.loginBtn}>Sign In</button>
               <div className={styles.textDivider}>
                  <span>OR</span>
                  <div className={styles.line}></div>
               </div>
               <button className={styles.googleBtn}>
                  <LogoGoogle color="white" />
                  Sign in via Student Email
               </button>
            </form>
         </div>
      </div>
   );
};

export default Login;
