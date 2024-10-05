import React from "react";
import styles from "./Register.module.scss";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";

import LogoIcon from "../../assets/images/logo.png";
import { IoEyeOutline } from "@react-icons/all-files/io5/IoEyeOutline";

const Register = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   const onSubmit = async (data) => {
      console.log(data);

      try {
         const url = "http://localhost:8080/students";
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         if (response.ok) {
            const student = await response.json();
            console.log(student);
            
         } else {
            console.log("Depota");
         }
      } catch (error) {
         console.error("Error:", error);
      }
   };

   return (
      <div className={styles.content}>
         <Helmet>
            <title>Marites University | Register</title>
         </Helmet>
         <div className={styles.container}>
            <div className={styles.sealContainer}>
               <img src={LogoIcon} alt="Marites University Seal" />
               <div className={styles.head}>
                  <h1 className={styles.title}>Portal Registration</h1>
                  <p>Create an account in Marites University</p>
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
                  <div>
                     <label>
                        Sex{" "}
                        {errors.sex && (
                           <span className={styles.errorMsg}>
                              ({errors.sex.message})
                           </span>
                        )}
                     </label>
                     <select
                        {...register("sex", {
                           required: "Sex is required",
                        })}
                     >
                        <option value="">Select Sex</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
               </div>
               <div className={styles.twoColumn}>
                  <div className={styles.course}>
                     <label>
                        Programme{" "}
                        {errors.programme && (
                           <span className={styles.errorMsg}>
                              ({errors.programme.message})
                           </span>
                        )}
                     </label>
                     <input
                        type="text"
                        {...register("programme", {
                           required: "Programme is required",
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
