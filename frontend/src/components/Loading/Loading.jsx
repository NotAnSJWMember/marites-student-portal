import React from "react";
import styles from "./Loading.module.scss";

const Loading = () => {
   return (
      <div className={styles.ldsRing}>
         <div></div>
         <div></div>
         <div></div>
         <div></div>
      </div>
   );
};

export default Loading;
