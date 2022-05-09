import { useToken } from "./Context/token-context";
import { useLocation, Navigate } from "react-router-dom";

const RequiresAuth = ({ children }) => {
  const { encodedToken } = useToken();
  let location = useLocation();
  return encodedToken === null || encodedToken === "" ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    children
  );
};

export default RequiresAuth;
