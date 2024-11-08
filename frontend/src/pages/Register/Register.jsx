import React from "react";
import PopupAlert from "../../components/Popup/PopupAlert";
import { FormUser } from "components/Forms/FormUser";
import { useRegister } from "../../hooks";
import { Helmet } from "react-helmet-async";

import styles from "./Register.module.scss";
import LogoIcon from "../../assets/images/logo.png";

const Register = () => {
   const { popupState, showPopup, setShowPopup, createAccount } = useRegister();

   const handleClosePopup = () => {
      setShowPopup(false);
   };

   return (
      <>
         <Helmet>
            <title>Register | Dr. AMMC</title>
         </Helmet>
         <div className={styles.contentWrapper}>
            <div className={styles.contentContainer}>
               <div className={styles.sealContainer}>
                  <img src={LogoIcon} alt="Dr. AMMC Seal" />
                  <div className={styles.head}>
                     <h1 className={styles.title}>Portal Registration</h1>
                     <p className={styles.desc}>
                        Create an account to start your session
                     </p>
                  </div>
               </div>
               <FormUser
                  role="student"
                  setShowPopup={setShowPopup}
                  createAccount={createAccount}
                  isRegister={true}
               />
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

export default Register;
