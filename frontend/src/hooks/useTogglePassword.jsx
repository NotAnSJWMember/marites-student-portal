import { useState } from "react";

export const useTogglePassword = () => {
   const [isPasswordVisible, setPasswordVisible] = useState(false);

   const togglePasswordVisibility = () => {
      setPasswordVisible((prevVisibility) => !prevVisibility);
   };

   return [isPasswordVisible, togglePasswordVisibility];
};

