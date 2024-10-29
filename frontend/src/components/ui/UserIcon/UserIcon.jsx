import React from "react";
import styles from "./UserIcon.module.scss";

export const UserIcon = ({image, desc, size}) => {
   return (
      <div
         className={styles.userIcon}
         style={{width: size, height: size}}
      >
         <img src={image} alt={desc} />
      </div>
   );
};

export default UserIcon;
