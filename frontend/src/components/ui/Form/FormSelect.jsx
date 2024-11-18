import React from "react";

const styles = {
   select: {
      width: "100%",
      borderRadius: "0.4rem",
      border: "1px solid #ccc",
   },
};

export const FormSelect = ({ name, value, options, register }) => (
   <select
      {...register(value, { required: `${name} is required` })}
      style={styles.select}
   >
      <option value="">Select {name}</option>
      {options.map((option) => (
         <option key={option.value} value={option.value}>
            {option.label}
         </option>
      ))}
   </select>
);
