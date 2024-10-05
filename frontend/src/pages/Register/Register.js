import React from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";

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
            <div className={styles.head}>
               <h1 className={styles.title}>Portal Registration</h1>
               <p>Create an account in Marites University</p>
            </div>
            <form
               className={styles.formContainer}
               onSubmit={handleSubmit(onSubmit)}
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
                     {errors.emailAd && (
                        <span className={styles.errorMsg}>
                           ({errors.emailAd.message})
                        </span>
                     )}
                  </label>
                  <input
                     type="email"
                     {...register("emailAd", {
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
                     })}
                  />
               </div>
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
               <div className={styles.twoColumn}>
                  <div className={styles.course}>
                     <label>
                        Programme{" "}
                        {errors.course && (
                           <span className={styles.errorMsg}>
                              ({errors.course.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("course", {
                           required: "Course is required",
                        })}
                     />
                  </div>
                  <div className={styles.course}>
                     <label>
                        Year{" "}
                        {errors.course && (
                           <span className={styles.errorMsg}>
                              ({errors.course.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("course", {
                           required: "Course is required",
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
                        {...register("password", {
                           required: "Password is required",
                        })}
                     />
                     <span className={styles.inputIcon}>
                        <IoEyeOutline color="gray" height="20px" width="20px" />
                     </span>
                  </div>
               </div>

               <div className={styles.twoColumn}>
                  <button>Reset</button>
                  <button type="submit" className={styles.submitBtn}>
                     Create account
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default Register;
