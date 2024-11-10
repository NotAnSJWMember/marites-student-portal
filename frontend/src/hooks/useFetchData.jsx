import { useState, useEffect } from "react";

const useFetchData = (endpoint) => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   
   const token = localStorage.getItem('token');

   useEffect(() => {
      let isMounted = true;

      const fetchData = async () => {
         try {
            const response = await fetch(`http://localhost:8080/${endpoint}`, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
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
            if (isMounted) setLoading(false);
         }
      };

      fetchData();

      return () => {
         isMounted = false;
      };
   }, [endpoint, token]);

   return { data, loading, error };
};

export default useFetchData;
