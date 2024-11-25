import React from "react";
import PopupAlert from "components/Popup/PopupAlert";
import { FormUser } from "components/Forms/FormUser";
import { Helmet } from "react-helmet-async";

import styles from "./Register.module.scss";
import LogoIcon from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import usePostData from "hooks/usePostData";
import useFetchData from "hooks/useFetchData";

const Register = () => {
  const { popupState, setShowPopup, showPopup, loading, postData } = usePostData();
  const { fetchData } = useFetchData("student");

  const navigate = useNavigate();

  const handleCreateUser = async (formData, role) => {
    const response = await postData(formData, role.toString(), fetchData, true);
    if (response) {
      setShowPopup(true);
      handleFinishCreation();
    }
  };

  const handleFinishCreation = () => {
    setTimeout(() => {
      navigate("/login");
    }, 800);
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
              <p className={styles.desc}>Create an account to start your session</p>
            </div>
          </div>
          <FormUser
            role="student"
            type="register"
            loading={loading}
            createdAction={handleFinishCreation}
            createAccount={handleCreateUser}
            isFirst={true}
          />
        </div>
      </div>
      <PopupAlert
        icon={popupState.icon}
        border={popupState.border}
        color={popupState.color}
        title={popupState.title}
        message={popupState.message}
        show={showPopup}
      />
    </>
  );
};

export default Register;
