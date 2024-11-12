import React, { createContext, useContext, useState, useCallback } from "react";

const RefetchDataContext = createContext();

export const RefetchDataProvider = ({ children }) => {
   const [refetchFunctions, setRefetchFunctions] = useState({});

   const registerRefetchFunction = useCallback((endpoint, refetchFunction) => {
      setRefetchFunctions((prev) => ({
         ...prev,
         [endpoint]: refetchFunction,
      }));
   }, []);

   const unregisterRefetchFunction = useCallback((endpoint) => {
      setRefetchFunctions((prev) => {
         const { [endpoint]: removed, ...rest } = prev;
         return rest;
      });
   }, []);

   return (
      <RefetchDataContext.Provider
         value={{ registerRefetchFunction, unregisterRefetchFunction }}
      >
         {children}
      </RefetchDataContext.Provider>
   );
};

export const useRefetchData = () => {
   const context = useContext(RefetchDataContext);
   if (!context) {
      throw new Error(
         "useRefetchData must be used within a RefetchDataProvider"
      );
   }
   return context;
};
