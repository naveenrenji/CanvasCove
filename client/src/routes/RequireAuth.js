import useAuth from "../useAuth";

const RequireAuth = ({ children }) => {
  let auth = useAuth();

  // TODO - If authentication is not successful, redirect users to error page

  return children;
};

export default RequireAuth;
