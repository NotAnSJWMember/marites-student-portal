import React from "react";
import styles from "./Login.module.scss";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading/Loading";
import { usePopupAlert, useTogglePassword, useLoading } from "../../hooks";

import PopupAlert from "../../components/Popup/PopupAlert";
import logo from "assets/images/logo.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
   const [showPassword, togglePasswordVisibility] = useTogglePassword();
   const { popupState, showPopup, setShowPopup, showError } = usePopupAlert();
   const { isLoading, withLoading } = useLoading();

   const navigate = useNavigate();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {
      await withLoading(async () => {
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
               const errorData = await response.json();
               showError(
                  "Oops! Something went wrong",
                  errorData?.message || "Could not login to your account."
               );
            }
         } finally {
            setShowPopup(true);
         }
      });
   };

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   return (
      <div>
         <div className={styles.formContainer}>
            <Helmet>
               <title>Login | Dr. AMMC</title>
            </Helmet>
            <div className={styles.container}>
               <div className={styles.sealContainer}>
                  <img src={logo} alt="Dr. AMMC Seal" />
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

                  <button type="submit" disabled={isLoading}>
                     Sign In {isLoading && <Loading />}
                  </button>
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

         <PopupAlert
            icon={popupState.icon}
            border={popupState.border}
            color={popupState.color}
            title={popupState.title}
            message={popupState.message}
            onClose={handleClosePopup}
            show={showPopup}
         />
      </div>
   );
};

export default Login;
