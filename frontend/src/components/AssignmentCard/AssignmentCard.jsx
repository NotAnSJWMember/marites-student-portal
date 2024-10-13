import React from "react";
import styles from "./AssignmentCard.module.scss";

export const AssignmentCard = ({ name, status, desc, due }) => {
   return (
      <div className={styles.card}>
         <div className={styles.titleContainer}>
            <h2>{name}</h2>
            <div className={styles.statusContainer}>
               <p>{status}</p>
            </div>
         </div>
         <div className={styles.infoContainer}>
            <p className={styles.infoDesc}>{desc}</p>
            <p className={styles.infoDue}>{due}</p>
         </div>
      </div>
   );
};

export default AssignmentCard;
