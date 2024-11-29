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
import { FormPassword } from "components/ui/Form";
import { useNavigate } from "react-router-dom";

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
  const { popupState, showPopup, setShowPopup, resetPassword } = useResetPassword();

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
            Password reset links expire after 15 minutes for security purposes. Please request
            another password reset link below to continue.
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
          <button type="button" onClick={navigate('/login')} className={styles.primaryBtn}>
            <button type="button">Return to Login</button>
          </button>
        ) : (
          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div>
              <label htmlFor="newPassword">New Password</label>
              <FormPassword
                name="newPassword"
                register={register}
                required={true}
                errors={errors}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <FormPassword
                name="confirmPassword"
                validate={true}
                validateName={newPassword}
                required={true}
                register={register}
                errors={errors}
              />
            </div>
            <button type="submit" className={styles.primaryBtn} disabled={loading}>
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
