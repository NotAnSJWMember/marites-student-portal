import { useState } from "react";

export const usePopupAlert = () => {
   const defaultState = {
      icon: "",
      title: "",
      message: "",
      border: "",
      color: "",
   };

   const [popupState, setPopupState] = useState(defaultState);
   const [showPopup, setShowPopup] = useState(false);

   const clearPopupState = () => {
      setPopupState(defaultState);
      setShowPopup(false);
   };

   const showError = (title, message) => {
      setPopupState({
         icon: "error",
         title,
         message,
         border: "#ffa7a7",
         color: "#ffd1d1",
      });
      setShowPopup(true);
      setTimeout(() => clearPopupState(), 2300);
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
      setTimeout(() => clearPopupState(false), 2300);
   };

   return { popupState, showPopup, setShowPopup, showError, showSuccess };
};
