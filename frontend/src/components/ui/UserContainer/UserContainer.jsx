import React from "react";
import styles from "./UserContainer.module.scss";
import UserIcon from "../UserIcon/UserIcon";
import { getUserPhoto } from "utils/getUserPhoto";

export const UserContainer = ({ user, size }) => {
  return (
    <div className={styles.userContainer}>
      <UserIcon image={getUserPhoto(user.userPhoto)} size={size} />
      <div>
        <h3 className={styles.title}>
          {user.firstName} {user.lastName}
        </h3>
        <p className={styles.desc}>{user.email}</p>
      </div>
    </div>
  );
};
