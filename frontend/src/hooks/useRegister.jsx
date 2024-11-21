import { useState } from "react";
import { usePopupAlert } from "./usePopupAlert";
import { getApiUrl } from "utils/api";

export const useRegister = () => {
  const { setShowPopup, showError, showSuccess, ...popupProps } = usePopupAlert();
  const [loading, setLoading] = useState(false);

  const createAccount = async (data, role, resetForm) => {
    setLoading(true);

    try {
      const url = getApiUrl();
      const response = await fetch(`${url}/${role}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showSuccess("Created account!", "You can now sign in with the registered account.");
        resetForm();
      } else {
        const errorData = await response.json();
        showError(
          "Oops! Something went wrong",
          errorData.message || "Could not create your account."
        );
      }
      return response;
    } catch (error) {
      showError(
        "Internal Server Error",
        error?.message || "An unexpected error occurred. Please try again."
      );
      return { ok: false };
    } finally {
      setShowPopup(true);
      setLoading(false);
    }
  };
  return { ...popupProps, setShowPopup, loading, createAccount };
};
