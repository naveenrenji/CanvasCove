import { createContext } from "react";

const AuthContext = createContext({
  user: {},
  error: "",
  signIn: () => {},
  signOut: () => {},
  isLoggedIn: false,
  getCurrentUser: () => ({}),
  // TODO: Add more context as and when required
});

export default AuthContext;
