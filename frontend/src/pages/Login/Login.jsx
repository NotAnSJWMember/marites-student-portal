import React from "react";
import styles from "./Login.module.scss";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../../components/Loading/Loading";
import { usePopupAlert, useLoading, useAuth } from "../../hooks";

import PopupAlert from "../../components/Popup/PopupAlert";
import logo from "assets/images/logo.png";
import { FormInput, FormPassword } from "components/ui/Form";

const Login = () => {
  const { popupState, showPopup, setShowPopup, showError } = usePopupAlert();
  const { isLoading, withLoading } = useLoading();
  const { login } = useAuth();
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
        const responseData = await login(data.userId, data.password);

        const { role } = responseData;

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "instructor") {
          navigate("/instructor/dashboard");
        } else if (role === "student") {
          navigate("/student/dashboard");
        }

        reset();
      } catch (error) {
        showError(
          "Oops! Something went wrong",
          error.response?.data?.message || "Could not login to your account."
        );
      } finally {
        setShowPopup(true);
      }
    });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
      <Helmet>
        <title>Login | Dr. AMMC</title>
      </Helmet>
      <div className={styles.contentWrapper}>
        <div className={styles.contentContainer}>
          <div className={styles.sealContainer}>
            <img src={logo} alt="Dr. AMMC Seal" />
            <div className={styles.head}>
              <h1 className={styles.title}>Portal</h1>
              <p className={styles.desc}>Sign in to start your session</p>
            </div>
          </div>
          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className={styles.formItem}>
              <label htmlFor="username">
                Username/Id{" "}
                {errors.userId && (
                  <span className={styles.errorMsg}>(This field is required)</span>
                )}
              </label>
              <FormInput type="text" name="userId" register={register} errors={errors} />
            </div>
            <div className={styles.formItem}>
              <label htmlFor="password">
                Password{" "}
                {errors.password && (
                  <span className={styles.errorMsg}>({errors.password.message})</span>
                )}
              </label>
              <FormPassword
                name="password"
                required={true}
                register={register}
                errors={errors}
              />
            </div>
            <a href="forgot-password" className={styles.ctaAnchor}>
              Forgot your password?
            </a>
            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
                Sign In {isLoading && <Loading />}
              </button>
              <div className={styles.textDivider}>
                <span>OR</span>
                <div className={styles.line}></div>
              </div>
              <a href="register">
                <button type="button" className={styles.redBtn}>
                  Create an account
                </button>
              </a>
            </div>
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
    </>
  );
};

export default Login;
