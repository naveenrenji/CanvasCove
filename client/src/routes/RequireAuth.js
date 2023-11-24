import useAuth from "../useAuth";

const RequireAuth = ({ children }) => {
  let auth = useAuth();

  // TODO - If authentication is not successful, redirect users to error page
  // TODO - use roles to authorize users. For example, only artists can access /art/create

  return children;
};

export default RequireAuth;
