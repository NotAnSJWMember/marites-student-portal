import React from "react";
import styles from "./EventCard.module.scss";

export const EventCard = ({ title, month, day, desc }) => {
   return (
      <div className={styles.card}>
         <div className={styles.dateContainer}>
            <p className={styles.dateMonth}>{month}</p>
            <p className={styles.dateDay}>{day}</p>
         </div>
         <div className={styles.infoContainer}>
            <h2 className={styles.infoTitle}>{title}</h2>
            <p className={styles.infoStatus}>Upcoming</p>
            <p className={styles.infoDesc}>{desc}</p>
         </div>
      </div>
   );
};

export default EventCard;
