import React from "react";
import styles from "./PopupAlert.module.scss";

import {
   IoCloseOutline,
   IoCheckmarkCircleOutline,
   IoAlertCircleOutline,
} from "react-icons/io5";
import { TbExclamationCircle } from "react-icons/tb";

const PopupAlert = ({ icon, color, border, title, message, onClose, show }) => {
   return (
      <div
         className={`${styles.popup} ${show ? styles.show : ""}`}
         style={{ backgroundColor: color, border: `1px solid ${border}` }}
      >
         <div className={styles.iconContainer}>
            {icon === "success" ? (
               <IoCheckmarkCircleOutline size={40} />
            ) : icon === "error" ? (
               <IoAlertCircleOutline size={40} />
            ) : icon === "warning" ? (
               <TbExclamationCircle size={40} />
            ) : null}
            <div>
               <p className={styles.title}>{title}</p>
               <p className={styles.message}>{message}</p>
            </div>
         </div>
         <div className={styles.closeBtn} onClick={onClose}>
            <IoCloseOutline size={20} />
         </div>
      </div>
   );
};

export default PopupAlert;
