import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Loader } from "./index";
import AuthContext from "../AuthContext";
import { setToStorage } from "../helpers";

const userAccessTokenKey = process.env.REACT_APP_USER_ACCESS_TOKEN_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

  const getCurrentUser = useCallback(async () => {
    // TODO: Get user either from local stroage or server and store in user
    // appLoaded should be set to true on success
    setTimeout(() => {
        setAppLoaded(true)
    }, 2000);
  }, []);

  useEffect(() => {
    // Get loggedIn status from local storage and set accordingly
    getCurrentUser();
  }, [getCurrentUser]);

  const signIn = useCallback(
    async (accesstoken, callback) => {
      setToStorage(userAccessTokenKey, accesstoken);
      setIsLoggedIn(!!accesstoken);
      await getCurrentUser();
      callback();
    },
    [getCurrentUser]
  );

  const authValues = useMemo(
    () => ({
      user,
      signIn,
      isLoggedIn,
      getCurrentUser,
    }),
    [
      user,
      signIn,
      isLoggedIn,
      getCurrentUser
    ]
  );

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
