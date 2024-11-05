/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";

import styles from "./ResetPassword.module.scss";
import LogoIcon from "../../assets/images/logo.png";
import PopupAlert from "../../components/Popup/PopupAlert";
import Loading from "../../components/Loading/Loading";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import { useValidateToken } from "../../hooks/useValidateToken";
import { useResetPassword } from "../../hooks/useResetPassword";
import { useTogglePassword } from "../../hooks/useTogglePassword";

const ResetPassword = () => {
   const {
      register,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
   } = useForm();

   const newPassword = watch("newPassword");

   const isTokenValid = useValidateToken();
   const { popupState, showPopup, setShowPopup, resetPassword } =
      useResetPassword();

   const [showNewPassword, toggleNewPasswordVisibility] = useTogglePassword();
   const [showConfirmPassword, toggleConfirmPasswordVisibility] =
      useTogglePassword();

   const [isEmailSent, setIsEmailSent] = useState(false);
   const [loading, setLoading] = useState(false);

   const onSubmit = async (data) => {
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get("token");

      const payload = {
         token: resetToken,
         newPassword: data.newPassword,
      };

      try {
         const response = await resetPassword(payload, reset);
         if (response.ok) {
            setIsEmailSent(true);
         }
      } finally {
         setLoading(false);
      }
   };

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   if (!isTokenValid) {
      return (
         <div className={styles.responseContainer}>
            <div className={styles.content}>
               <h2>Your reset token is invalid or has expired</h2>
               <p>
                  Password reset links expire after 15 minutes for security
                  purposes. Please request another password reset link below to
                  continue.
               </p>
               <a href="forgot-password">
                  <button type="button" className={styles.primaryBtn}>
                     Reset password again
                  </button>
               </a>
            </div>
         </div>
      );
   }

   return (
      <div className={styles.container}>
         <Helmet>
            <title>Reset Password | Dr. AMMC</title>
         </Helmet>
         <div className={styles.content}>
            <div className={styles.head}>
               <img src={LogoIcon} alt="Dr. AMMC Seal" />
               <h1 className={styles.title}>
                  {isEmailSent ? "Back to Login" : "Enter your new password"}
               </h1>
               <p className={styles.desc}>
                  {isEmailSent
                     ? "Your password has been successfully reset! You can now return to the login page and sign in with your new password."
                     : "Lesson learned! You should definitely take note of your passwords."}
               </p>
            </div>
            {isEmailSent ? (
               <a href="login">
                  <button type="button">Return to Login</button>
               </a>
            ) : (
               <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div>
                     <label htmlFor="newPassword">
                        New Password{" "}
                        {errors.newPassword && (
                           <span className={styles.errorMsg}>
                              ({errors.newPassword.message})
                           </span>
                        )}
                     </label>
                     <div className={styles.inputMerge}>
                        <input
                           type={showNewPassword ? "text" : "password"}
                           {...register("newPassword", {
                              required: "This field is required",
                           })}
                        />
                        <span
                           className={styles.inputIcon}
                           onClick={toggleNewPasswordVisibility}
                        >
                           {showNewPassword ? (
                              <IoEyeOffOutline color="gray" size={20} />
                           ) : (
                              <IoEyeOutline color="gray" size={20} />
                           )}
                        </span>
                     </div>
                  </div>
                  <div>
                     <label htmlFor="confirmPassword">
                        Confirm Password{" "}
                        {errors.confirmPassword && (
                           <span className={styles.errorMsg}>
                              ({errors.confirmPassword.message})
                           </span>
                        )}
                     </label>
                     <div className={styles.inputMerge}>
                        <input
                           type={showConfirmPassword ? "text" : "password"}
                           {...register("confirmPassword", {
                              required: "This field is required",
                              validate: (value) =>
                                 value === newPassword ||
                                 "Passwords do not match",
                           })}
                        />
                        <span
                           className={styles.inputIcon}
                           onClick={toggleConfirmPasswordVisibility}
                        >
                           {showConfirmPassword ? (
                              <IoEyeOffOutline color="gray" size={20} />
                           ) : (
                              <IoEyeOutline color="gray" size={20} />
                           )}
                        </span>
                     </div>
                  </div>
                  <button type="submit" disabled={loading}>
                     Update password {loading && <Loading />}
                  </button>
               </form>
            )}

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
      </div>
   );
};

export default ResetPassword;
