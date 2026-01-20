import { Navigate } from "react-router-dom";
import { URLS } from "../../urls";

const ProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem("token");
  return auth ? children : <Navigate to={URLS.HOME} />;
};

export default ProtectedRoute;
