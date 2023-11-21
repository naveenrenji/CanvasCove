import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  isLoggedIn: false,
  signIn: () => {}
  // TODO: Add more context as and when required
});

export default AuthContext;
