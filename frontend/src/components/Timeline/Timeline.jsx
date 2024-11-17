import React from "react";
import styles from "./Timeline.module.scss";
import { TbCircle, TbCircleCheckFilled, TbCircleFilled } from "react-icons/tb";
import IconSizes from "constants/IconSizes";

const COLOR_GREEN = "#3c853c";
const COLOR_YELLOW = "#e2ad39";
const COLOR_BLACK = "#5c5c5c";

const Timeline = ({ items, currentStep }) => {
  return (
    <div className={styles.timeline}>
      {items.map((item, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.idk}>
            {currentStep === index ? (
              <TbCircleFilled size={IconSizes.SMALL} color={COLOR_YELLOW} />
            ) : item.isDone ? (
              <TbCircleCheckFilled size={IconSizes.SMALL} color={COLOR_GREEN} />
            ) : (
              <TbCircle size={16} color={COLOR_BLACK} />
            )}
            {index < items.length - 1 && <div className={styles.line}></div>}
          </div>

          <div className={styles.content}>
            <span className={styles.label}>{item.label}</span>
            {item.description && (
              <span className={styles.description}>{item.description}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
