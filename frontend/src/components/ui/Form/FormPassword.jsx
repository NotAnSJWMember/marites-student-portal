import { useTogglePassword } from "hooks";
import React from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

const styles = {
  inputMerge: {
    display: "flex",
    borderRadius: "0.4rem",
    border: "1px solid #ccc",
    backgroundColor: "white",
  },
  input: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  inputIcon: {
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    cursor: "pointer",
  },
  selectError: {
    border: "1px solid #c92f2f",
  },
  errorMsg: {
    fontSize: "smaller",
    fontStyle: "italic",
    color: "#c92f2f",
  },
};

export const FormPassword = ({
  name,
  placeholder,
  required = true,
  validate = false,
  validateName,
  register,
  errors,
  ...props
}) => {
  const [showPassword, togglePasswordVisibility] = useTogglePassword();
  const hasError = errors?.[name];

  return (
    <div className={styles.formItem}>
      <div
        style={{
          ...styles.inputMerge,
          ...(hasError ? styles.selectError : {}),
        }}
      >
        <input
          style={styles.input}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...register(name, {
            ...(required && {
              required: `${placeholder ? placeholder : "This field"} is required`,
            }),
            ...(validate && {
              validate: (value) => value === validateName || "Passwords do not match",
            }),
          })}
          {...props}
        />
        <span style={styles.inputIcon} onClick={togglePasswordVisibility}>
          {!showPassword ? (
            <TbEye color="gray" size={20} />
          ) : (
            <TbEyeOff color="gray" size={20} />
          )}
        </span>
      </div>
      {placeholder && hasError && <span style={styles.errorMsg}>{errors[name]?.message}</span>}
    </div>
  );
};
