import { usePopupAlert } from "./usePopupAlert";

export const useResetPassword = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();

   const resetPassword = async (payload, resetForm) => {
      try {
         const url = "http://localhost:8080/user/reset-password";
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
         });

         if (!response.ok) {
            const errorData = await response.json();
            showError(
               "Oops! Something went wrong",
               errorData.message || "Password reset failed. Please try again."
            );
         } else {
            resetForm();
         }
         return response;
      } catch (error) {
         showError(
            "Internal Server Error",
            error?.message || "An unexpected error occurred. Please try again."
         );
         return { ok: false };
      }
   };
   return { ...popupProps, setShowPopup, resetPassword };
};
