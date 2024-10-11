import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, roles }) => {
   const token = localStorage.getItem("token");

   const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

   if (!user || !roles.includes(user.role)) {
      return <Navigate to="/login" />;
   }

   return element;
};

export default PrivateRoute;