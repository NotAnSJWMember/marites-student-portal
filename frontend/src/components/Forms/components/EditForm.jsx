import React, { memo, useEffect, useState } from "react";
import styles from "../FormUser.module.scss";

import IconSizes from "constants/IconSizes";
import UserIcon from "components/ui/UserIcon/UserIcon";
import { TbEdit, TbId } from "react-icons/tb";
import { FormInput, FormPassword, FormSelect } from "components/ui/Form";
import { FormStudent } from "../FormStudent";
import CustomDatePicker from "components/CustomDatePicker/CustomDatePicker";
import { getUserPhoto } from "utils/getUserPhoto";

const EditForm = memo(
  ({
    role,
    errors,
    register,
    userData,
    programOptions,
    yearOptions,
    setEditedEmail,
    editedEmail,
    setEditedName,
    editedName,
    setSelectedDate,
    selectedDate,
    setSelectedGender,
    selectedGender,
    setSelectedImage,
    selectedImage,
    setSelectedProgram,
    selectedProgram,
    selectedYearLevel,
    setSelectedYearLevel,
    setPreview,
    preview,
  }) => {
    const [mode, setMode] = useState("view");

    useEffect(() => {
      if (userData) {
        setEditedName(`${userData.firstName} ${userData.lastName}`);
        setEditedEmail(userData.email);
        setSelectedDate(userData.birthDate);
        setPreview(getUserPhoto(userData.userPhoto));
        userData.gender === "Male"
          ? setSelectedGender({ value: "Male", label: "Male" })
          : setSelectedGender({ value: "Female", label: "Female" });
      }
    }, [
      setEditedEmail,
      setEditedName,
      setPreview,
      setSelectedDate,
      setSelectedGender,
      setSelectedImage,
      userData,
    ]);

    const handleEditInfo = () => {
      setMode("view");
    };

    return (
      <>
        <div className={styles.userContainer}>
          <div>
            <UserIcon
              size={110}
              editable={true}
              preview={preview}
              setPreview={setPreview}
              setSelectedImage={setSelectedImage}
              desc={`User ${userData.userId}'s profile photo`}
            />
          </div>
          <div className={styles.spaceBetween}>
            {mode === "view" ? (
              <div className={styles.userInfo}>
                <div className={styles.alignCenter}>
                  <h2 className={styles.title}>{editedName}</h2>
                  <button
                    type="button"
                    className={styles.ctaBtn}
                    onClick={() => setMode("edit")}
                  >
                    <TbEdit size={IconSizes.LARGE} />
                  </button>
                </div>
                <p className={styles.desc}>{editedEmail}</p>
              </div>
            ) : (
              <div className={styles.editDetailsContainer}>
                <div>
                  <div>
                    <input
                      type="text"
                      className={styles.editName}
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder={`${userData.firstName} ${userData.lastName}`}
                    />
                  </div>
                  <input
                    type="email"
                    className={styles.editEmail}
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder={userData.email}
                  />
                </div>
                <button
                  type="submit"
                  className={styles.secondaryBtn}
                  onClick={() => handleEditInfo()}
                >
                  Save details
                </button>
              </div>
            )}
            <div className={`${styles.badge} ${styles.iconLabel}`}>
              <span className={styles.studentId}>
                <TbId size={IconSizes.SMALL} />
                <strong>Student ID</strong>
              </span>
              <p>{userData.userId}</p>
            </div>
          </div>
        </div>
        <div className={styles.twoColumn}>
          <h4>Login</h4>
          <div className={styles.twoColumn}>
            <FormInput
              type="text"
              name="username"
              placeholder="Username"
              required={false}
              register={register}
              errors={errors}
            />
            <div className={styles.formItem}>
              <FormPassword
                name="password"
                placeholder="Enter new password"
                required={false}
                register={register}
                errors={errors}
              />
            </div>
          </div>
        </div>
        <div className={styles.line}></div>
        {role === "student" && (
          <FormStudent
            userData={userData}
            programOptions={programOptions}
            yearOptions={yearOptions}
            setSelectedProgram={setSelectedProgram}
            selectedProgram={selectedProgram}
            selectedYearLevel={selectedYearLevel}
            setSelectedYearLevel={setSelectedYearLevel}
          />
        )}
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Contact</h4>
          <div className={styles.formItem}>
            <FormInput
              type="tel"
              name="phoneNum"
              placeholder="Phone number"
              required={false}
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
            selectedData={selectedGender}
            setSelectedData={setSelectedGender}
          />
        </div>
      </>
    );
  }
);

export default EditForm;
