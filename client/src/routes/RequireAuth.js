import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../useAuth";
import { USER_ROLES } from "../constants";

const isArtSavePage = (pathname) => {
  const editArtRegex = new RegExp("^/art/[0-9a-fA-F]{24}/edit$", "i");
  return pathname === "art/create" || editArtRegex.test(pathname);
};

const RequireAuth = ({ children }) => {
  let auth = useAuth();

  let location = useLocation();

  if (!auth?.isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isArtSavePage(location.pathname)) {
    if (auth?.user?.role === USER_ROLES.ARTIST) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default RequireAuth;
