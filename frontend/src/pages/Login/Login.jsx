import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";

import Popup from "../../components/Popup/Popup";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

import logoIcon from "../../assets/images/logo.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
   const [showPassword, setShowPassword] = useState(false);
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const [popupTitle, setPopupTitle] = useState("");
   const [popupMessage, setPopupMessage] = useState("");
   const [popupIcon, setPopupIcon] = useState("");
   const [popupBorder, setPopupBorder] = useState("");
   const [popupColor, setPopupColor] = useState("");
   const [showPopup, setShowPopup] = useState(false);

   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {
      try {
         const url = "http://localhost:8080/user/login";
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         if (response.ok) {
            const responseData = await response.json();
            const { token, role } = responseData;

            localStorage.setItem("token", token);

            if (role === "admin") {
               navigate("/admin/dashboard");
            } else if (role === "teacher") {
               navigate("/teacher/dashboard");
            } else if (role === "student") {
               navigate("/student/dashboard");
            }

            reset();
         } else {
            setPopupTitle("Error");
            setPopupMessage("Login failed.");
            setPopupIcon("error");
            setPopupColor("#ffd1d1");
            setPopupBorder("#ffa7a7");
         }
      } catch (error) {
         console.error("Error:", error);
      }
      setShowPopup(true);
   };

   const [timeoutId, setTimeoutId] = useState(null);
   const handleClosePopup = () => {
      const id = setTimeout(() => {
         setShowPopup(false);
      }, 300);

      setTimeoutId(id);
   };

   useEffect(() => {
      return () => {
         clearTimeout(timeoutId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <div>
         <div className={styles.formContainer}>
            <Helmet>
               <title>Dr. AMMC | Login</title>
            </Helmet>
            <div className={styles.container}>
               <div className={styles.sealContainer}>
                  <img src={logoIcon} alt="Dr. AMMC Seal" />
               </div>
               <div className={styles.head}>
                  <h1 className={styles.title}>Student Portal</h1>
                  <p>Sign in to start your session</p>
               </div>
               <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <label htmlFor="username">
                     Username/School Id{" "}
                     {errors.userId && (
                        <span className={styles.errorMsg}>
                           ({errors.userId.message})
                        </span>
                     )}
                  </label>
                  <input
                     type="text"
                     {...register("userId", {
                        required: "This field is required",
                     })}
                  />

                  <label htmlFor="password">
                     Password{" "}
                     {errors.password && (
                        <span className={styles.errorMsg}>
                           ({errors.password.message})
                        </span>
                     )}
                  </label>
                  <div className={styles.inputMerge}>
                     <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                           required: "Password is required",
                        })}
                     />
                     <span
                        className={styles.inputIcon}
                        onClick={togglePasswordVisibility}
                     >
                        {showPassword ? (
                           <IoEyeOffOutline color="gray" size={20} />
                        ) : (
                           <IoEyeOutline color="gray" size={20} />
                        )}
                     </span>
                  </div>

                  <a href="forgot-password" className={styles.ctaForgot}>
                     Forgot your password?
                  </a>

                  <button type="submit">Sign In</button>
                  <div className={styles.textDivider}>
                     <span>OR</span>
                     <div className={styles.line}></div>
                  </div>
                  <a href="register" className={styles.createBtn}>
                     <button type="button">Create an account</button>
                  </a>
               </form>
            </div>
         </div>
         <Popup
            icon={popupIcon}
            border={popupBorder}
            color={popupColor}
            title={popupTitle}
            message={popupMessage}
            onClose={handleClosePopup}
            show={showPopup}
         />
      </div>
   );
};

export default Login;
