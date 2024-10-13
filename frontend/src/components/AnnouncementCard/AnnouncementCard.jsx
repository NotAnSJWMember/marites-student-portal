import React from "react";
import styles from "./AnnouncementCard.module.scss";
import { TbNews } from "react-icons/tb";

export const AnnouncementCard = ({ title, date, link }) => {
   return (
      <div className={styles.card}>
         <div className={styles.wrapper}>
            <div className={styles.iconContainer}>
               <TbNews size={23} />
            </div>
            <div className={styles.infoContainer}>
               <h2>{title}</h2>
               <p>{date}</p>
            </div>
         </div>
         <a href={link} className={styles.ctaBtn}>
            <button type="button">Read</button>
         </a>
      </div>
   );
};

export default AnnouncementCard;
