import { useState } from "react";
import { usePopupAlert } from "hooks";

import { getApiUrl } from "utils/api";

const usePostData = () => {
  const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();
  const [loading, setLoading] = useState(false);

  const postData = async (data, endpoint, fetchData, isFileUpload = false) => {
    setLoading(true);

    try {
      const url = getApiUrl();
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      console.log("File upload? ", isFileUpload);

      if (isFileUpload) {
        for (const [key, value] of data.entries()) {
          console.log(`${key}:`, value);
        }
        options.body = data;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`${url}/${endpoint}`, options);
      if (!response.ok) throw new Error(`Failed to post data to ${endpoint}`);

      const contentType = response.headers.get("Content-Type");
      let responseData = {};
      if (contentType && contentType.includes("application/json"))
        responseData = await response.json();

      showSuccess("Success!", responseData.message || "Data posted successfully.");
      if (fetchData) fetchData();

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
