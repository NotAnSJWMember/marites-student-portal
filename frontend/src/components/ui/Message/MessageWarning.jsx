import React from "react";
import { TbAlertTriangle } from "react-icons/tb";

const styles = {
   messageContainer: {
      display: "flex",
      border: "1px solid #ff7373",
      backgroundColor: "#ffdddd",
      borderRadius: "0.4rem",
      gap: "0.7rem",
      // maxWidth: "20rem",
      padding: "1rem",
      textWrap: "balance",
   },
   title: {
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "3px",
   },
   message: {
      fontSize: "0.8rem",
      opacity: "0.5",
   },
};

export const MessageWarning = ({ title, message }) => {
   return (
      <div style={styles.messageContainer}>
         <TbAlertTriangle size={24} color="#ff7373" />
         <div>
            <h2 style={styles.title}>{title}</h2>
            <p style={styles.message}>{message}</p>
         </div>
      </div>
   );
};
