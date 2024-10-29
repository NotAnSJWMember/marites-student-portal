import React from "react";

const styles = {
   label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
   },
   error: {
      color: "red",
      marginLeft: "5px",
   },
};

export const FormLabel = ({ htmlFor, error }) => (
   <label htmlFor={htmlFor}>
      {error && <span className={styles.error}>({error})</span>}
   </label>
);
