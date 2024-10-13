/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./Popup.module.scss";

const Popup = ({ show, close, position, children }) => {
   const [shouldRender, setShouldRender] = useState(false);
   const popupRef = useRef(null);

   const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
         onClose();
      }
   };

   useEffect(() => {
      if (show) {
         setShouldRender(true);
         setTimeout(() => {
            if (popupRef.current) {
               popupRef.current.classList.add(styles.show);
            }
         }, 100);

         document.addEventListener("mousedown", handleClickOutside);
      } else {
         if (popupRef.current) {
            popupRef.current.classList.remove(styles.show);
         }
         setTimeout(() => {
            setShouldRender(false);
         }, 300);
      }

      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [show]);

   const onClose = () => {
      close();
   };

   if (!shouldRender) return null;

   return (
      <div
         ref={popupRef}
         className={`${styles.popupContent} ${styles[position]}`}
         onClick={(e) => e.stopPropagation()}
      >
         {children}
      </div>
   );
};

export default Popup;
