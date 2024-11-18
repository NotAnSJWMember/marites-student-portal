import React from "react";

const styles = {
   input: {
      width: "100%",
      borderRadius: "0.4rem",
      border: "1px solid #ccc",
      padding: "0.7rem",
      outline: "none",
   },
   errorMsg: {
      fontSize: "smaller",
      fontStyle: "italic",
      color: "#c92f2f",
   },
};

export const FormInput = ({ type, name, placeholder, register, ...props }) => (
   <input
      placeholder={placeholder}
      style={styles.input}
      type={type}
      id={name}
      {...register(name, { required: `${name} is required` })}
      {...props}
   />
);
