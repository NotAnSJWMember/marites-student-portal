import { useTogglePassword } from "hooks";
import { capitalize } from "lodash";
import React from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";

const styles = {
  inputMerge: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderRadius: "0.4rem",
    border: "1px solid #ccc",
    backgroundColor: "white",
  },
  input: {
    flex: "1",
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

export const FormPassword = ({ name, placeholder, register, errors, ...props }) => {
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
          {...register(name, { required: `${placeholder} is required` })}
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
      {hasError && <span style={styles.errorMsg}>{errors[name]?.message}</span>}
    </div>
  );
};
