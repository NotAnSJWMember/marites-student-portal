import { useState } from "react";
import { usePopupAlert } from "hooks";

const usePostData = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } =
      usePopupAlert();
   const [loading, setLoading] = useState(false);

   const postData = async (data, endpoint) => {
      setLoading(true);
      try {
         const response = await fetch(`http://localhost:8080/${endpoint}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);

         const responseData = await response.json();
         showSuccess(
            "Success!",
            responseData.message || "Data posted successfully!"
         );
      } catch (error) {
         showError(
            "Internal Server Error",
            error?.message || "An unexpected error occurred. Please try again."
         );
      } finally {
         setLoading(false);
      }
   };

   return { ...popupProps, postData, loading, setShowPopup };
};

export default usePostData;
