import React from "react";
import { TbInfoCircle } from "react-icons/tb";

const styles = {
   messageContainer: {
      display: "flex",
      border: "1px solid #7195c9",
      backgroundColor: "#e6ebf0",
      borderRadius: "0.4rem",
      gap: "0.7rem",
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

export const MessageInfo = ({ title, message }) => {
   return (
      <div style={styles.messageContainer}>
         <TbInfoCircle size={24} color="#7195c9" />
         <div>
            <h2 style={styles.title}>{title}</h2>
            <p style={styles.message}>{message}</p>
         </div>
      </div>
   );
};
