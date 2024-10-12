import { usePopup } from "./usePopup";

export const useRegister = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } = usePopup();

   const createAccount = async (data, resetForm) => {
      try {
         const url = "http://localhost:8080/user";
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         if (response.ok) {
            showSuccess(
               "Created account!",
               "You can now sign in with the registered account."
            );
            resetForm();
         } else {
            const errorData = await response.json();
            showError(
               "Oops! Something went wrong",
               errorData.message || "Could not create your account."
            );
         }
         return response;
      } catch (error) {
         showError(
            "Internal Server Error",
            error?.message || "An unexpected error occurred. Please try again."
         );
         return { ok: false };
      } finally {
         setShowPopup(true);
      }
   };
   return {...popupProps, setShowPopup, createAccount}
};