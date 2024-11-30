import { useCallback, useState } from "react";
import { usePopupAlert } from "hooks";

import { getApiUrl } from "utils/api";

const useDeleteData = (endpoint) => {
  const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const deleteData = useCallback(
    async (ids, fetchData) => {
      setLoadingDelete(true);

      const isBatch = Array.isArray(ids);
      const url = getApiUrl();

      let apiUrl = isBatch
        ? `${url}/${endpoint}/batch-delete`
        : `${url}/${endpoint}/${ids}`;

      try {
        const response = await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          ...(isBatch && { body: JSON.stringify({ userIds: ids }) }),
        });

        if (!response.ok) throw new Error(`Failed to delete from ${endpoint}`);

        const responseData = await response.json();
        showSuccess("Success!", responseData.message || "Data deleted successfully!");

        fetchData();
      } catch (error) {
        showError(
          "Internal Server Error",
          error?.message || "An unexpected error occurred. Please try again."
        );
      } finally {
        setLoadingDelete(false);
      }
    },
    [endpoint, showError, showSuccess]
  );

  return {
    ...popupProps,
    setShowPopup,
    loading: loadingDelete,
    deleteData,
  };
};

export default useDeleteData;
