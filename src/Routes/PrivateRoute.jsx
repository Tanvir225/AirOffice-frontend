import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../Hook/useAuth";


const PrivateRoute = ({ children }) => {
  //users and loading
  const { user, loading } = useAuth();

  //location
  const location = useLocation();

  if (loading) {
     return <p className="flex justify-center items-center min-h-screen">
      <span className="loading loading-infinity loading-lg"></span>
    </p>;
  }

  if (user) {
    return children;
  }

  return <Navigate to={"/login"} state={{ from: location }} replace></Navigate>;
};

export default PrivateRoute;