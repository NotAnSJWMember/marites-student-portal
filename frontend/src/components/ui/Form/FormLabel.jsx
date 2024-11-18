import React from "react";

const styles = {
  label: {
    display: "inline-block",
    marginBottom: "0.5rem",
  },
};

export const FormLabel = ({ htmlFor, value }) => (
  <label style={styles.label} htmlFor={htmlFor}>
    {value}
  </label>
);
