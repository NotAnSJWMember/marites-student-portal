import React from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import PopupAlert from "../../components/Popup/PopupAlert";
import LogoIcon from "../../assets/images/logo.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import { useRegister, useTogglePassword } from "../../hooks";

const Register = () => {
   const [showPassword, togglePasswordVisibility] = useTogglePassword();
   const { popupState, showPopup, setShowPopup, createAccount } = useRegister();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {
      const response = await createAccount(data, reset);
      if (response.ok) {
         setShowPopup(true);
      }
   };

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   return (
      <div className={styles.content}>
         <Helmet>
            <title>Register | Dr. AMMC</title>
         </Helmet>
         <div className={styles.container}>
            <div className={styles.sealContainer}>
               <img src={LogoIcon} alt="Dr. AMMC Seal" />
               <div className={styles.head}>
                  <h1 className={styles.title}>Portal Registration</h1>
                  <p>Create an account to start your session</p>
               </div>
            </div>
            <form
               className={styles.formContainer}
               onSubmit={handleSubmit(onSubmit)}
               autoComplete="off"
            >
               <div className={styles.twoColumn}>
                  <div className={styles.firstName}>
                     <label>
                        First Name{" "}
                        {errors.firstName && (
                           <span className={styles.errorMsg}>
                              ({errors.firstName.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("firstName", {
                           required: "First name is required",
                        })}
                     />
                  </div>
                  <div className={styles.lastName}>
                     <label>
                        Last Name{" "}
                        {errors.lastName && (
                           <span className={styles.errorMsg}>
                              ({errors.lastName.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("lastName", {
                           required: "Last name is required",
                        })}
                     />
                  </div>
               </div>
               <div>
                  <label>
                     Email Address{" "}
                     {errors.email && (
                        <span className={styles.errorMsg}>
                           ({errors.email.message})
                        </span>
                     )}
                  </label>
                  <input
                     type="email"
                     {...register("email", {
                        required: "Email address is required",
                     })}
                  />
               </div>
               <div>
                  <label>
                     Phone Number{" "}
                     {errors.phoneNum && (
                        <span className={styles.errorMsg}>
                           ({errors.phoneNum.message})
                        </span>
                     )}
                  </label>
                  <input
                     type="tel"
                     {...register("phoneNum", {
                        required: "Phone number is required",
                        pattern: {
                           value: /^\+?\d{1,3}?\s?\d{10}$/,
                           message: "Phone number must be 10 digits",
                        },
                     })}
                  />
               </div>
               <div className={styles.twoColumn}>
                  <div>
                     <label>
                        Birthdate{" "}
                        {errors.birthDate && (
                           <span className={styles.errorMsg}>
                              ({errors.birthDate.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="date"
                        {...register("birthDate", {
                           required: "Birthdate is required",
                        })}
                     />
                  </div>
                  <div className={styles.gender}>
                     <label>
                        Gender{" "}
                        {errors.gender && (
                           <span className={styles.errorMsg}>
                              ({errors.gender.message})
                           </span>
                        )}
                     </label>
                     <select
                        {...register("gender", {
                           required: "Gender is required",
                        })}
                     >
                        <option value="">Select gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
               </div>
               <div className={styles.twoColumn}>
                  <div className={styles.course}>
                     <label>
                        Program{" "}
                        {errors.program && (
                           <span className={styles.errorMsg}>
                              ({errors.program.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("program", {
                           required: "Program is required",
                        })}
                     />
                  </div>
                  <div className={styles.year}>
                     <label>
                        Year{" "}
                        {errors.year && (
                           <span className={styles.errorMsg}>
                              ({errors.year.message})
                           </span>
                        )}
                     </label>
                     <select
                        {...register("year", {
                           required: "Year is required",
                        })}
                     >
                        <option value="">Select Year</option>
                        <option value="1">First year</option>
                        <option value="2">Second year</option>
                        <option value="3">Third year</option>
                        <option value="4">Fourth year</option>
                     </select>
                  </div>
               </div>
               <div>
                  <label>
                     Username{" "}
                     {errors.username && (
                        <span className={styles.errorMsg}>
                           ({errors.username.message})
                        </span>
                     )}
                  </label>
                  <input
                     type="text"
                     {...register("username", {
                        required: "Username is required",
                     })}
                  />
               </div>
               <div>
                  <label>
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
               </div>
               <button
                  type="submit"
                  className={styles.primaryBtn}
                  title="Create account with given details"
               >
                  Create account
               </button>
               <a href="login" className={styles.ctaAnchor}>Already have an account? Sign In</a>
            </form>

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

export default Register;
