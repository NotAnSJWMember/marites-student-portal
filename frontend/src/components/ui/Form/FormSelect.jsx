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

export const FormSelect = ({ name, value, options, register, onChange }) => (
   <div className={styles.formItem}>
      <select
         {...register(value, { required: `${name} is required` })}
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
