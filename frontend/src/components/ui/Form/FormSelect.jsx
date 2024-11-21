import { capitalize } from "lodash";
import React from "react";

const styles = {
  select: {
    width: "100%",
    borderRadius: "0.4rem",
    border: "1px solid #ccc",
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

export const FormSelect = ({ name, value, options, register, errors, ...props }) => {
  const hasError = errors?.[value];

  return (
    <div className={styles.formItem}>
      <select
        style={{
          ...styles.select,
          ...(hasError ? styles.selectError : {}),
        }}
        {...register(value, { required: `${capitalize(name)} is required` })}
        {...props}
      >
        <option value="">Select {name}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && <span style={styles.errorMsg}>{errors[value]?.message}</span>}
    </div>
  );
};
