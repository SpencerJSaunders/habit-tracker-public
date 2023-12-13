import { useSelector } from "react-redux";
import _isEmpty from "lodash/isEmpty";
import AccessDenied from "./AccessDenied";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.userDetails);
  const userHasAccessToRoute = !_isEmpty(user);

  return userHasAccessToRoute ? children : <AccessDenied />;
};

export default ProtectedRoute;
