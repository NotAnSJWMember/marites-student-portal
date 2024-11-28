import React, { useEffect, useMemo, useState } from "react";
import styles from "./FormUser.module.scss";
import Loading from "components/Loading/Loading";

import { useForm } from "react-hook-form";
import { startCase } from "lodash";
import RegisterForm from "./components/RegisterForm";
import EditForm from "./components/EditForm";
import useFetchData from "hooks/useFetchData";

export const FormUser = ({
  role,
  type,
  loading,
  handleDelete,
  createdAction,
  createAccount,
  userData = {},
  isFirst = false,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYearLevel, setSelectedYearLevel] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editedName, setEditedName] = useState(null);
  const [editedEmail, setEditedEmail] = useState(null);

  const { data: programs } = useFetchData("program");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const programOptions = useMemo(() => {
    return programs.map((p) => {
      const label = p.description.replace(/Bachelor of (Science|Arts) in /, "");

      return {
        value: p._id,
        label,
      };
    });
  }, [programs]);

  const yearOptions = useMemo(() => {
    const baseOptions = [
      { value: 1, label: "First Year" },
      { value: 2, label: "Second Year" },
      { value: 3, label: "Third Year" },
      { value: 4, label: "Fourth Year" },
    ];
    if (selectedProgram?.duration === 5) {
      baseOptions.push({ value: 5, label: "Fifth Year" });
    }
    return baseOptions;
  }, [selectedProgram]);

  useEffect(() => {
    if (userData && type === "edit") {
      setValue("username", userData.username || "");
      setValue("phoneNum", userData.phoneNum || "");
    }
  }, [setValue, type, userData]);

  const onCreateSubmit = async (data) => {
    let firstAndMiddleName = "";
    let lastName = "";

    if (type === "edit") {
      const nameParts = editedName.trim().split(" ");
      firstAndMiddleName = nameParts.slice(0, nameParts.length - 1).join(" ");
      lastName = nameParts[nameParts.length - 1];
    }

    let userData = {
      ...data,
      gender: selectedGender?.value,
      programId: selectedProgram?.value,
      yearLevel: selectedYearLevel?.value,
      birthDate: !selectedDate ? data.birthDate : selectedDate.toString(),
      firstName: !editedName ? startCase(data.firstName) : firstAndMiddleName,
      lastName: !editedName ? startCase(data.lastName) : lastName,
    };

    if (type === "edit") {
      userData = {
        ...userData,
        email: editedEmail,
      };
    }

    const formData = new FormData();

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    formData.append("userData", JSON.stringify(userData));

    console.log("Submitted Data;", userData);
    if (type === "register") {
      await createAccount(formData, role.toString());
    } else {
      await createAccount(formData);
    }
  };

  const ActionButton = ({ onClick, label }) => (
    <button type="button" className={styles.secondaryBtn} onClick={onClick}>
      {label}
    </button>
  );

  const SubmitButton = ({ label, loading }) => (
    <button type="submit" className={styles.primaryBtn}>
      {label}
      {loading && <Loading />}
    </button>
  );

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onCreateSubmit)}>
      {type === "register" ? (
        <RegisterForm
          role={role}
          register={register}
          errors={errors}
          userData={userData}
          programOptions={programOptions}
          yearOptions={yearOptions}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
          selectedProgram={selectedProgram}
          setSelectedProgram={setSelectedProgram}
          selectedYearLevel={selectedYearLevel}
          setSelectedYearLevel={setSelectedYearLevel}
        />
      ) : (
        <EditForm
          role={role}
          errors={errors}
          register={register}
          userData={userData}
          programOptions={programOptions}
          yearOptions={yearOptions}
          setEditedEmail={setEditedEmail}
          editedEmail={editedEmail}
          setEditedName={setEditedName}
          editedName={editedName}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          setSelectedGender={setSelectedGender}
          selectedGender={selectedGender}
          setSelectedImage={setSelectedImage}
          selectedImage={selectedImage}
          setSelectedProgram={setSelectedProgram}
          selectedProgram={selectedProgram}
          selectedYearLevel={selectedYearLevel}
          setSelectedYearLevel={setSelectedYearLevel}
          setPreview={setPreview}
          preview={preview}
        />
      )}
      <div className={type === "register" ? styles.buttonContainer : styles.spaceBetween}>
        {type === "edit" && (
          <button
            type="button"
            className={styles.redBtn}
            style={{ justifySelf: "start" }}
            onClick={() => handleDelete(true)}
          >
            Delete user
          </button>
        )}
        {type === "register" ? (
          <>
            {isFirst ? (
              <a href="login" className={styles.ctaAnchor}>
                Already have an account?
              </a>
            ) : (
              <ActionButton onClick={createdAction} label="Cancel" />
            )}
            <SubmitButton label="Create account" loading={loading} />
          </>
        ) : (
          <div className={styles.buttonContainer}>
            <ActionButton onClick={createdAction} label="Cancel" />
            <SubmitButton label="Save changes" loading={loading} />
          </div>
        )}
      </div>
    </form>
  );
};
