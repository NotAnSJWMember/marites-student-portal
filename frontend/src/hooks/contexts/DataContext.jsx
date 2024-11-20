import axios from "axios";
import React, { createContext, useState, useEffect, useContext } from "react";
import { getApiUrl } from "utils/api";

const DataContext = createContext();

export const useDataContext = (endpoint) => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }

  const { dataState, loadingState, errorState } = context;

  if (!dataState || !loadingState || !errorState) {
    throw new Error("Data, loading or error state is missing from the context");
  }

  const data = dataState[endpoint];
  const loading = loadingState[endpoint];
  const error = errorState[endpoint];

  if (!data) {
    console.log("Data has not been loaded yet for this endpoint.");
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

  const fetchData = async (endpoint) => {
    try {
      const response = await axios.get(`${getApiUrl()}/${endpoint}`);

      setDataState((prev) => ({
        ...prev,
        [endpoint]: response.data,
      }));
    } catch (error) {
      setErrorState((prev) => ({
        ...prev,
        [endpoint]: error.message || "Error fetching data",
      }));
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [endpoint]: false,
      }));
    }
  };

  useEffect(() => {
    const endpoints = [
      "course",
      "student",
      "instructor",
      "section",
      "enrollment",
      "curriculum",
      "program",
    ];

    endpoints.forEach((endpoint) => {
      if (!dataState[endpoint]) {
        fetchData(endpoint);
      }
    });
  }, []);

  return (
    <DataContext.Provider value={{ dataState, loadingState, errorState, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
