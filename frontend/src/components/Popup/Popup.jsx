/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./Popup.module.scss";

const Popup = ({
   show,
   close,
   position,
   handleClickOutside = true,
   children,
}) => {
   const positionClass = styles[position];
   const [shouldRender, setShouldRender] = useState(false);
   const popupRef = useRef(null);

   const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
         close();
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

         if (handleClickOutside) {
            document.addEventListener("mousedown", handleOutsideClick);
         }
      } else {
         if (popupRef.current) {
            popupRef.current.classList.remove(styles.show);
         }
         setTimeout(() => {
            setShouldRender(false);
         }, 300);
      }

      return () => {
         if (handleClickOutside) {
            document.removeEventListener("mousedown", handleOutsideClick);
         }
      };
   }, [show, handleClickOutside]);

   if (!shouldRender) return null;

   const popupStyles = {
      top: position.top,
      left: position.left,
      transform: position.transform,
   };

   return (
      <div
         ref={popupRef}
         className={`${styles.popupContent} ${positionClass}`}
         style={popupStyles}
         onClick={(e) => e.stopPropagation()}
      >
         {children}
      </div>
   );
};

export default Popup;
