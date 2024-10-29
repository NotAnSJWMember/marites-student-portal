import React, { useState } from "react";

import PopupAlert from "components/Popup/PopupAlert";
import Loading from "components/Loading/Loading";
import UserIcon from "components/ui/UserIcon/UserIcon";
import { FormInput, FormSelect } from "components/ui/Form";
import { useRegister, useTogglePassword, usePopupAlert } from "hooks";
import { useForm } from "react-hook-form";
import useFetchData from "hooks/useFetchData";

import styles from "./FormUser.module.scss";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { TbCloudDownload } from "react-icons/tb";

export const FormStudent = ({ onBack }) => {
   const [selectedProgram, setSelectedProgram] = useState(null);
   const [showPassword, togglePasswordVisibility] = useTogglePassword();
   const { popupState, showPopup, setShowPopup, createAccount } = useRegister();
   const { showError } = usePopupAlert();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const yearOptions = [
      { value: "1", label: "First Year" },
      { value: "2", label: "Second Year" },
      { value: "3", label: "Third Year" },
      { value: "4", label: "Fourth Year" },
   ];

   const token = localStorage.getItem("token");
   const { data: programs, loading, error } = useFetchData("program", token);

   const onCreateSubmit = async (data) => {
      const birthDateString = data.birthDate;
      const birthDate = new Date(birthDateString);
      const userData = { ...data, birthDate };
      const response = await createAccount(userData, reset);

      if (response.ok) setShowPopup(true);
   };

   const handleProgramChange = (event) => {
      const collegeCode = event.target.value;
      const program = programs.find((p) => p.collegeCode === collegeCode);
      setSelectedProgram(program);
   };

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   if (selectedProgram?.duration === 5)
      yearOptions.push({ value: "5", label: "Fifth Year" });

   if (loading) return <Loading />;
   if (error) showError("Oops! Something went wrong", error);

   const MEDIUM_ICON_SIZE = 22;

   return (
      <div>
         <form
            className={styles.formContainer}
            onSubmit={handleSubmit(onCreateSubmit)}
            autoComplete="off"
         >
            <div className={styles.twoColumn}>
               <h4>Program</h4>
               <div className={styles.twoColumn}>
                  <FormSelect
                     name="Program"
                     options={programs.map((program) => ({
                        value: program.collegeCode,
                        label: program.programDescription,
                     }))}
                     register={register}
                     onChange={handleProgramChange}
                  />
                  <FormSelect
                     name="Year"
                     options={yearOptions}
                     register={register}
                  />
               </div>
            </div>
            <div className={styles.buttonContainer}>
               <button
                  type="button"
                  onClick={onBack}
                  className={`${styles.cancelBtn} ${styles.ctaBtn}`}
               >
                  Previous step
               </button>
               <button
                  type="submit"
                  className={`${styles.submitBtn} ${styles.ctaBtn}`}
               >
                  Add user
               </button>
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
         </form>
      </div>
   );
};
