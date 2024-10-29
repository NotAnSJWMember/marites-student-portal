import { useState, useEffect } from "react";

const useFetchUsers = (endpoint, token) => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      let isMounted = true;

      const fetchUsers = async () => {
         try {
            const response = await fetch(endpoint, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            });

            if (!response.ok) {
               throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
         } catch (error) {
            setError(error.message);
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      fetchUsers();

      return () => {
         isMounted = false;
      };
   }, [endpoint, token]);

   return { users, loading, error };
};

export default useFetchUsers;
