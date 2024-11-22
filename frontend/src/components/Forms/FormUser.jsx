import React, { useEffect } from "react";
import styles from "./FormUser.module.scss";
import { TbCloudDownload } from "react-icons/tb";

import IconSizes from "constants/IconSizes";
import UserIcon from "components/ui/UserIcon/UserIcon";
import Loading from "components/Loading/Loading";
import { FormInput, FormPassword, FormSelect } from "components/ui/Form";
import { FormStudent } from "./FormStudent";

import { useForm } from "react-hook-form";
import { startCase } from "lodash";

export const FormUser = ({ role, loading, createdAction, createAccount, isRegister }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onCreateSubmit = async (data) => {
    const yearLevel = parseInt(data.yearLevel);
    const birthDate = new Date(data.birthDate);
    const firstName = startCase(data.firstName);
    const lastName = startCase(data.lastName);

    const userData = { ...data, yearLevel, birthDate, firstName, lastName };
    const response = await createAccount(userData, role.toString(), reset);
    if (response.ok) createdAction();
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onCreateSubmit)}>
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
        <div className={styles.changePhotoContainer}>
          <UserIcon
            image={"/images/default-user-photo.png"}
            desc="New user's profile photo"
            size={80}
          />
          <div className={styles.changePhoto}>
            <button type="button" className={styles.iconBtn}>
              <TbCloudDownload size={IconSizes.MEDIUM} />
            </button>
            <p>
              <span>Click to upload</span> or drag and drop <br />
              SVG, PNG, or JPG (max. 2MB)
            </p>
          </div>
        </div>
      </div>
      <div className={styles.line}></div>
      {role === "student" && <FormStudent register={register} errors={errors} />}
      <div className={styles.buttonContainer}>
        {isRegister ? (
          <a href="login" className={styles.ctaAnchor}>
            Already have an account?
          </a>
        ) : (
          <button onClick={createdAction} type="button" className={styles.secondaryBtn}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.primaryBtn}>
          Create account
          {loading && <Loading />}
        </button>
      </div>
    </form>
  );
};
