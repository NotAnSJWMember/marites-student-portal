import React from "react";
import styles from "./CourseCard.module.scss";
import { TbMapPin } from "react-icons/tb";

export const CourseCard = ({
   title,
   catalog,
   block,
   time,
   date,
   room,
   teacher,
}) => {
   return (
      <div className={styles.card}>
         <div className={styles.cardTitle}>
            <p className={styles.infoBlock}>{block}</p>
            <div className={styles.cardLabel}>
               <h2>{title}</h2>
               <div className={styles.catalogLabel}>{catalog}</div>
            </div>
         </div>
         <div className={styles.cardInfo}>
            <p className={styles.infoTime}>{time}</p>
            <h3 className={styles.infoTeacher}>{teacher}</h3>
            <div className={styles.line}></div>
            <p className={`${styles.infoRoom} ${styles.iconLabel}`}>
               <TbMapPin size={23} />
               {room}
            </p>
         </div>
      </div>
   );
};

export default CourseCard;
