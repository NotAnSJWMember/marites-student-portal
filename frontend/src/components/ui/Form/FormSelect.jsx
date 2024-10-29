// FormSelect.jsx
import React from "react";

const styles = {
   formItem: {
      marginBottom: "15px",
   },
   select: {
      width: "100%",
      borderRadius: "0.5rem",
      border: "1px solid #ccc",
   },
};

export const FormSelect = ({
   name,
   options,
   register,
   errorname,
   errormessage,
   onChange,
}) => (
   <div className={styles.formItem}>
      {errorname && <span style={styles.errorText}>{errormessage}</span>}
      <select
         id={name}
         {...register(name, { required: `${name} is required` })}
         onChange={onChange}
         style={styles.select}
      >
         <option value="">Select {name}</option>
         {options.map((option) => (
            <option key={option.value} value={option.value}>
               {option.label}
            </option>
         ))}
      </select>
   </div>
);
