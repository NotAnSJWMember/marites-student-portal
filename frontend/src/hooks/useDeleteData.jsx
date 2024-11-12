import { useState } from "react";
import { usePopupAlert } from "hooks";

const useDeleteData = () => {
   const { setShowPopup, showError, showSuccess, ...popupProps } =
      usePopupAlert();
   const [loading, setLoading] = useState(false);

   const token = localStorage.getItem("token");
   const deleteData = async (endpoint, key) => {
      setLoading(true);
      try {
         const response = await fetch(
            `http://localhost:8080/${endpoint}/${key}`,
            {
               method: "DELETE",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);

         const responseData = await response.json();
         showSuccess(
            "Success!",
            responseData.message || "Data deleted successfully!"
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

   return { ...popupProps, deleteData, loading, setShowPopup };
};

export default useDeleteData;
