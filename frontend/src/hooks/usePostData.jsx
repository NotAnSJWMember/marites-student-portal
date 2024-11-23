import { useState } from "react";
import { usePopupAlert } from "hooks";

import { getApiUrl } from "utils/api";

const usePostData = () => {
  const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();
  const [loading, setLoading] = useState(false);

  const postData = async (data, endpoint, fetchData) => {
    setLoading(true);
    try {
      const url = getApiUrl();
      const response = await fetch(`${url}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);

      const contentType = response.headers.get("Content-Type");
      let responseData = {};
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      }

      showSuccess("Success!", responseData.message || "Data posted successfully!");

      fetchData();

      return responseData;
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
