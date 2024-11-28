import React, { memo } from "react";
import styles from "../FormUser.module.scss";

import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker";
import UploadWidget from "components/UploadWidget/UploadWidget";
import { FormInput, FormPassword, FormSelect } from "components/ui/Form";
import { FormStudent } from "../FormStudent";

const RegisterForm = memo(
  ({
    userData,
    role,
    errors,
    register,
    programOptions,
    yearOptions,
    selectedDate,
    setSelectedDate,
    setSelectedGender,
    selectedGender,
    setSelectedFile,
    selectedFile,
    selectedProgram,
    setSelectedProgram,
    selectedYearLevel,
    setSelectedYearLevel,
  }) => {
    return (
      <>
        <div className={styles.twoColumn}>
          <h4>Name</h4>
          <div className={styles.twoColumn}>
            <FormInput
              type="text"
              name="firstName"
              placeholder="First name"
              register={register}
              errors={errors}
            />
            <FormInput
              type="text"
              name="lastName"
              placeholder="Last name"
              register={register}
              errors={errors}
            />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Birthdate</h4>
          <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Gender</h4>
          <FormSelect
            name="gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            setSelectedData={setSelectedGender}
            selectedData={selectedGender}
          />
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Login</h4>
          <div className={styles.twoColumn}>
            <FormInput
              type="text"
              name="username"
              placeholder="Username"
              register={register}
              errors={errors}
            />
            <FormPassword
              name="password"
              placeholder="Password"
              register={register}
              errors={errors}
            />
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Contact</h4>
          <div className={styles.twoColumn}>
            <FormInput
              type="text"
              name="email"
              placeholder="Email address"
              register={register}
              errors={errors}
            />
            <div className={styles.formItem}>
              <FormInput
                type="tel"
                name="phoneNum"
                placeholder="Phone number"
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Profile Photo</h4>
          <UploadWidget fileSelect={setSelectedFile} selectedFile={selectedFile} />
        </div>
        {role === "student" && (
          <FormStudent
            userData={userData}
            programOptions={programOptions}
            yearOptions={yearOptions}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
            selectedYearLevel={selectedYearLevel}
            setSelectedYearLevel={setSelectedYearLevel}
            errors={errors}
          />
        )}
      </>
    );
  }
);

export default RegisterForm;
