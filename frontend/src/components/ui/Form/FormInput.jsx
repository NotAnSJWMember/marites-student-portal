import React from "react";

const styles = {
  input: {
    width: "100%",
    borderRadius: "0.4rem",
    border: "1px solid #ccc",
    padding: "0.7rem",
    outline: "none",
  },
  inputError: {
    border: "1px solid #c92f2f",
  },
  errorMsg: {
    fontSize: "smaller",
    fontStyle: "italic",
    color: "#c92f2f",
  },
};

export const FormInput = ({
  type,
  name,
  placeholder,
  required = true,
  register,
  errors,
  ...props
}) => {
  const hasError = errors?.[name];

  return (
    <div className={styles.formItem}>
      <input
        placeholder={placeholder}
        style={{
          ...styles.input,
          ...(hasError ? styles.inputError : null),
        }}
        type={type}
        id={name}
        {...register(name, {
          ...(required && { required: `${placeholder} is required` }),
          ...(required &&
            type === "tel" && {
              pattern: {
                value: /^[0-9]{11}$/,
                message: "Phone number must be exactly 11 digits",
              },
            }),
        })}
        {...props}
      />
      <div>
        {placeholder && hasError && (
          <span style={styles.errorMsg}>{errors[name]?.message}</span>
        )}
      </div>
    </div>
  );
};
