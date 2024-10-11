import { useState } from "react";

export const usePopup = () => {
   const [popupState, setPopupState] = useState({
      icon: "",
      title: "",
      message: "",
      border: "",
      color: "",
   });

   const [showPopup, setShowPopup] = useState(false);

   const showError = (title, message) => {
      setPopupState({
         icon: "error",
         title,
         message,
         border: "#ffa7a7",
         color: "#ffd1d1",
      });
      setShowPopup(true);
   };

   const showSuccess = (title, message) => {
      setPopupState({
         icon: "success",
         title,
         message,
         border: "#63be77",
         color: "#b0ffc1",
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
   };

   return { popupState, showPopup, setShowPopup, showError, showSuccess };
};
