import { Navigate } from "react-router-dom";
import { useAuth } from "hooks";

const PrivateRoute = ({ element, roles }) => {
   const { user } = useAuth()

   if (!user) {
      return <Navigate to="/login" />;
   }

   if (!roles) {
      return <Navigate to="/unauthorized" />;
   }

   return element;
};

export default PrivateRoute;
