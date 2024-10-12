import { useState } from "react";

export const useLoading = () => {
   const [isLoading, setIsLoading] = useState(false);

   const withLoading = async (func) => {
      setIsLoading(true);
      try {
         await func();
      } finally {
         setIsLoading(false);
      }
   };

   return { isLoading, withLoading };
};
