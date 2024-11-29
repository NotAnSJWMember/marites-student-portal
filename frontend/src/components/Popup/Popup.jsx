/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import styles from "./Popup.module.scss";

const Popup = ({ show, close, position, children, handleClickOutside = true }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const positionClass = styles[position];
  const popupRef = useRef(null);

  const popupStyles = {
    top: position?.top,
    left: position?.left,
  };

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
      }, 200);
    }

    return () => {
      if (handleClickOutside) {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
    };
  }, [show, handleClickOutside]);

  if (!shouldRender) return null;

  return (
    <div
      style={popupStyles}
      className={`${styles.popupContent} ${positionClass}`}
      onClick={(e) => e.stopPropagation()}
      ref={popupRef}
    >
      {children}
    </div>
  );
};

export default Popup;
