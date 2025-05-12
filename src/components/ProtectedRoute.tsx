import { Navigate } from "react-router";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoute = ({ children }) => {
  const user = useAppSelector((state) => state.user.user);
  console.log("ProtectedRoute user:", user);

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
