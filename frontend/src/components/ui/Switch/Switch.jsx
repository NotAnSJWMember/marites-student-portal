import React from "react";
import styles from "./Switch.module.scss";

const Switch = ({ checked, onChange, style }) => {
   return (
      <label className={styles.switch}>
         <input type="checkbox" checked={checked} onChange={onChange} />
         <span className={styles.slider} style={style}></span>
      </label>
   );
};

export default Switch;
