
import { usePopupAlert } from "./usePopupAlert";
import { getApiUrl } from "utils/api";

export const useForgetPassword = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();

   const forgetPassword = async (data, resetForm) => {
      try {
         const url = getApiUrl();
         const response = await fetch(`${url}/auth/forgot-password`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
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
   return { ...popupProps, setShowPopup, forgetPassword };
};
