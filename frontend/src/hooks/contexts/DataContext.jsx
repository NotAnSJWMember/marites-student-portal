import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { getApiUrl } from "utils/api";

const DataContext = createContext();

const getToken = () => {
  return localStorage.getItem("token");
};

let endpointId = null;
let url = null;

export const useDataContext = (endpoint, id = null) => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  const { dataState, loadingState, errorState } = context;

  if (!dataState || !loadingState || !errorState) {
    throw new Error("Data, loading or error state is missing from the context");
  }

  const data = id ? dataState[`${endpoint}_${id}`] : dataState[endpoint];
  const loading = id ? loadingState[`${endpoint}_${id}`] : loadingState[endpoint];
  const error = id ? errorState[`${endpoint}_${id}`] : errorState[endpoint];

  if (id) {
    url = endpoint;
    endpointId = id;
  }

  return {
    dataState: data || [],
    loadingState: loading || false,
    errorState: error || null,
  };
};

export const DataProvider = ({ children }) => {
  const [dataState, setDataState] = useState({});
  const [loadingState, setLoadingState] = useState({});
  const [errorState, setErrorState] = useState({});

  const fetchData = async (endpoint, id = null) => {
    const token = getToken();

    let url = `${getApiUrl()}/${endpoint}`;
    if (id) {
      url = `${url}/${id}`;
    }

    try {
      setLoadingState((prev) => ({
        ...prev,
        [id ? `${endpoint}_${id}` : endpoint]: true,
      }));

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDataState((prev) => ({
        ...prev,
        [id ? `${endpoint}_${id}` : endpoint]: response.data,
      }));
    } catch (error) {
      setErrorState((prev) => ({
        ...prev,
        [id ? `${endpoint}_${id}` : endpoint]: error.message || "Error fetching data",
      }));
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [id ? `${endpoint}_${id}` : endpoint]: false,
      }));
    }
  };

  useEffect(() => {
    const endpoints = [
      "student",
      "instructor",
      "enrollment",
      "curriculum",
      "section",
      "course",
      "program",
      "schedule",
      "finance",
    ];

    if (!dataState[endpoints]) {
      if (endpointId) {
        fetchData(url, endpointId);
      }
      endpoints.forEach((endpoint) => {
        fetchData(endpoint);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider value={{ dataState, loadingState, errorState, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
