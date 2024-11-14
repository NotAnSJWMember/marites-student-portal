import React from "react";
import styles from "./Timeline.module.scss";

const Timeline = ({ items, currentStep }) => {
   return (
      <div className={styles.timeline}>
         {items.map((item, index) => (
            <div className={styles.timelineItem} key={index}>
               <div
                  className={`${styles.circle} ${
                     currentStep === index ? styles.active : ""
                  }`}
               ></div>
               <div className={styles.content}>
                  <span className={styles.label}>{item.label}</span>
                  {item.description && (
                     <span className={styles.description}>
                        {item.description}
                     </span>
                  )}
               </div>
               {index < items.length - 1 && <div className={styles.line}></div>}
            </div>
         ))}
      </div>
   );
};

export default Timeline;
