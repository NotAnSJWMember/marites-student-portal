// FormInput.jsx
import React from "react";

const styles = {
   input: {
      width: "100%",
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
   register,
   placeholder,
   ...props
}) => (
   <div className={styles.formItem}>
      <input
         placeholder={placeholder}
         style={styles.input}
         type={type}
         id={name}
         {...register(name, { required: `${name} is required` })}
         {...props}
      />
   </div>
);
