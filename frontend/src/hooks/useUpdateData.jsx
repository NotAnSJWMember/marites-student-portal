import { useState } from "react";
import { usePopupAlert } from "hooks";

import { getApiUrl } from "utils/api";

const useUpdateData = () => {
  const { setShowPopup, showError, showWarning, showSuccess, ...popupProps } = usePopupAlert();
  const [loading, setLoading] = useState(false);

  const updateData = async (data, endpoint, key = null, fetchData, isFileUpload = false) => {
    setLoading(true);

    try {
      let url = `${getApiUrl()}/${endpoint}`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      if (key) {
        url = `${getApiUrl()}/${endpoint}/${key}`;
      }

      if (isFileUpload) {
        options.body = data;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Failed to put data to ${endpoint}`);

      const contentType = response.headers.get("Content-Type");

      let responseData = {};

      if (contentType && contentType.includes("application/json"))
        responseData = await response.json();

      const length = Object.keys(responseData).length;
      if (length > 1) {
        showSuccess("Success!", responseData.message || "Updated successfully!");
      } else {
        showWarning("Warning", responseData.message || "No changes were made.");
      }

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

  return { ...popupProps, updateData, loading, setShowPopup };
};

export default useUpdateData;
