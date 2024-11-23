import { useState } from "react";
import { usePopupAlert } from "hooks";

import { getApiUrl } from "utils/api";

const useUpdateData = () => {
  const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();
  const [loading, setLoading] = useState(false);

  const updateData = async (data, endpoint, key, fetchData) => {
    setLoading(true);
    try {
      const url = getApiUrl();
      const response = await fetch(`${url}/${endpoint}/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);

      const responseData = await response.json();
      showSuccess("Success!", responseData.message || "Data updated successfully!");
      fetchData();
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
