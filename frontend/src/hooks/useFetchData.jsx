import { useState, useEffect, useCallback } from "react";
import { useRefetchData } from "./contexts/useRefetchData";

const useFetchData = (endpoint, shouldRefetch = false) => {
   const { registerRefetchFunction, unregisterRefetchFunction } =
      useRefetchData();
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const fetchData = useCallback(async () => {
      setLoading(true);

      try {
         const response = await fetch(`http://localhost:8080/${endpoint}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         });
         if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
         }

         const data = await response.json();
         setData(data);
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   }, [endpoint]);

   useEffect(() => {
      fetchData();
   }, [fetchData, shouldRefetch]);

   useEffect(() => {
      registerRefetchFunction(endpoint, fetchData);

      return () => {
         unregisterRefetchFunction(endpoint);
      };
   }, [
      endpoint,
      fetchData,
      registerRefetchFunction,
      unregisterRefetchFunction,
   ]);

   return { data, loading, error, fetchData };
};

export default useFetchData;
