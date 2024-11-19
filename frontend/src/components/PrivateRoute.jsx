import { Navigate } from "react-router-dom";
import { useAuth } from "hooks";

const PrivateRoute = ({ element, roles }) => {
  const { user } = useAuth();

  // console.log("Attempting to render route:", element);
  // console.log("Required roles:", roles);
  // console.log("User role:", user.role);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles) {
    console.warn("Unauthorized access to route.");
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;
