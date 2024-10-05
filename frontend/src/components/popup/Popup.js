import React from "react";
import styles from "./Popup.module.scss";

import { IoCheckmarkCircleOutline } from "@react-icons/all-files/io5/IoCheckmarkCircleOutline";

const Popup = ({ title, message, onClose }) => {
   return (
      <div className={styles.overlay}>
         <div className={styles.popup}>
            <div className={styles.iconContainer}>
               <IoCheckmarkCircleOutline />
            </div>
            <div className={styles.content}>
               <h2>{title}</h2>
               <p>{message}</p>
            </div>
            <button onClick={onClose}></button>
         </div>
      </div>
   );
};

export default Popup;
