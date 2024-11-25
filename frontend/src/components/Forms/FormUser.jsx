import React, { useEffect, useState } from "react";
import styles from "./FormUser.module.scss";
import Loading from "components/Loading/Loading";
import { FormInput, FormPassword, FormSelect } from "components/ui/Form";
import { FormStudent } from "./FormStudent";

import { useForm } from "react-hook-form";
import { startCase } from "lodash";
import UploadWidget from "components/UploadWidget/UploadWidget";
import UserIcon from "components/ui/UserIcon/UserIcon";
import { getUserPhoto } from "utils/getUserPhoto";
import { TbEdit, TbId } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

export const FormUser = ({
  role,
  type,
  loading,
  createdAction,
  createAccount,
  userData = {},
  isFirst = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    console.log(selectedFile)
  })

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-CA");
  };

  useEffect(() => {
    if (userData) {
      setValue("firstName", userData.firstName || "");
      setValue("lastName", userData.lastName || "");
      setValue("birthDate", formatDate(userData.birthDate) || "");
      setValue("gender", userData.gender || "");
      setValue("username", userData.username || "");
      setValue("email", userData.email || "");
      setValue("phoneNum", userData.phoneNum || "");
      setValue("yearLevel", userData.yearLevel || "");
    }
  }, [userData, setValue]);

  const onCreateSubmit = async (data) => {
    const userData = {
      ...data,
      yearLevel: parseInt(data.yearLevel, 10),
      birthDate: new Date(data.birthDate).toISOString(),
      firstName: startCase(data.firstName),
      lastName: startCase(data.lastName),
    };
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("userData", JSON.stringify(userData));
    await createAccount(formData, role.toString());
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

  const RegisterForm = () => {
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
          <FormInput
            type="date"
            name="birthDate"
            placeholder="Birth date"
            register={register}
            errors={errors}
          />
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Gender</h4>
          <FormSelect
            name="gender"
            value="gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            register={register}
            errors={errors}
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
            <div className={styles.formItem}>
              <FormPassword
                name="password"
                placeholder="Password"
                register={register}
                errors={errors}
              />
            </div>
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
            setValue={setValue}
            register={register}
            errors={errors}
          />
        )}
      </>
    );
  };

  const EditForm = () => {
    return (
      <>
        <div className={styles.userContainer}>
          {/* <UserIcon
            image={selectedImage}
            desc={`User ${userData.userId}'s profile photo`}
            size={110}
            editable={true}
            setImage={setSelectedImage}
          /> */}

          <div className={styles.userInfo}>
            <div className={styles.alignCenter}>
              <h2 className={styles.title}>
                {userData.firstName} {userData.lastName}
              </h2>
              <TbEdit size={IconSizes.LARGE} />
            </div>
            <p className={styles.desc}>{userData.email}</p>
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
              register={register}
              errors={errors}
            />
            <div className={styles.formItem}>
              <FormPassword
                name="password"
                placeholder="Enter new password"
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
            setValue={setValue}
            register={register}
            errors={errors}
          />
        )}
        {role === "instructor" && (
          <FormStudent
            userData={userData}
            setValue={setValue}
            register={register}
            errors={errors}
          />
        )}
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
          <h4>Birthdate</h4>
          <FormInput
            type="date"
            name="birthDate"
            placeholder="Birth date"
            register={register}
            errors={errors}
          />
        </div>
        <div className={styles.line}></div>
        <div className={styles.twoColumn}>
          <h4>Gender</h4>
          <FormSelect
            name="gender"
            value="gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            register={register}
            errors={errors}
          />
        </div>
      </>
    );
  };

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit(onCreateSubmit)}
    >
      {type === "register" ? <RegisterForm /> : <EditForm />}
      <div
        className={
          type === "register" ? styles.buttonContainer : styles.spaceBetween
        }
      >
        {type === "edit" && (
          <button
            type="button"
            className={styles.redBtn}
            style={{ justifySelf: "start" }}
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
