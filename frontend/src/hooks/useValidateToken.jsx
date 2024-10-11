import { useState, useEffect } from "react";

export const useValidateToken = () => {
   const [isTokenValid, setIsTokenValid] = useState(true);

   useEffect(() => {
      const validateToken = async () => {
         const urlParams = new URLSearchParams(window.location.search);
         const resetToken = urlParams.get("token");

         if (!resetToken) {
            console.error("No reset token found in the URL");
            setIsTokenValid(false);
            return;
         }

         try {
            const url = `http://localhost:8080/user/validate-reset-token?token=${resetToken}`;

            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
            });

            const result = await response.json();

            setIsTokenValid(response.ok && result.isValid);
         } catch (error) {
            console.error("Error validating token:", error);
            setIsTokenValid(false);
         }
      };

      validateToken();
   }, []);

   return isTokenValid;
};