import { useState } from "react";
import { usePopupAlert } from "hooks";

const useUpdateData = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } =
      usePopupAlert();
   const [loading, setLoading] = useState(false);

   const updateData = async (data, endpoint, key, token) => {
      setLoading(true);
      try {
         const response = await fetch(`http://localhost:8080/${endpoint}/${key}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);

         const responseData = await response.json();
         showSuccess(
            "Success!",
            responseData.message || "Data updated successfully!"
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

   return { ...popupProps, updateData, loading, setShowPopup };
};

export default useUpdateData;
