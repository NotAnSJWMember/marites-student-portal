import React from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";

import logoIcon from "../../assets/images/logo.png";
import { IoEyeOutline } from "@react-icons/all-files/io5/IoEyeOutline";

const Register = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      console.log(data);
   };

   return (
      <div className={styles.content}>
         <div className={styles.container}>
            <div className={styles.sealContainer}>
               <img src={logoIcon} alt="Marites University Seal" />
               <div className={styles.head}>
                  <h1 className={styles.title}>Portal Registration</h1>
                  <p>Create an account in Marites University</p>
               </div>
            </div>
            <form
               className={styles.formContainer}
               onSubmit={handleSubmit(onSubmit)}
            >
               <div className={styles.nameColumn}>
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
                        autoComplete="false"
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
                        autoComplete="false"
                        {...register("lastName", {
                           required: "Last name is required",
                        })}
                     />
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
                     autoComplete="false"
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
                        type="password"
                        autoComplete="false"
                        {...register("password", {
                           required: "Password is required",
                        })}
                     />
                     <span className={styles.inputIcon}>
                        <IoEyeOutline color="gray" height="20px" width="20px" />
                     </span>
                  </div>
               </div>

               <button type="submit">Create account</button>
            </form>
         </div>
      </div>
   );
};

export default Register;
