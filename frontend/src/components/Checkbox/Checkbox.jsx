import React from "react";
import styles from "./Checkbox.module.scss";

const Checkbox = ({ id, isChecked, onChange }) => {
   return (
      <div>
         <input 
            type="checkbox"
            id={id}
            className={styles.hiddenCheckbox}
            checked={isChecked}
            onChange={onChange} 
         />
         <label htmlFor={id} className={styles.newCheckbox}></label>
      </div>
   );
};

export default Checkbox;
