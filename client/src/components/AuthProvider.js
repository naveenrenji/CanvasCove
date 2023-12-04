import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Loader } from "./index";
import AuthContext from "../AuthContext";
import { clearFromStorage, getFromStorage, setToStorage } from "../helpers";
import { getLoggedInUser } from "../api/auth";

const userAccessTokenKey = process.env.REACT_APP_USER_ACCESS_TOKEN_KEY;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appLoaded, setAppLoaded] = useState(false);

  const getCurrentUser = useCallback(async () => {
    try {
      setError();
      const accessToken = getFromStorage(userAccessTokenKey);
      if (!accessToken) {
        setAppLoaded(true);
        return;
      };
      setAppLoaded(false);
      const data = await getLoggedInUser();
      setUser(data);
    } catch (error) {
      setError("Could not get your details. Please try again.");
    } finally {
      setAppLoaded(true);
    };
  }, []);

  useEffect(() => {
    // Get loggedIn status from local storage and set accordingly
    if (getFromStorage(userAccessTokenKey)) {
      setIsLoggedIn(true);
    };
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

  const signOut = useCallback(async (callback) => {
    setUser();
    setIsLoggedIn(false);
    clearFromStorage(userAccessTokenKey);
    callback();
  }, []);

  const authValues = useMemo(
    () => ({
      user,
      error,
      signIn,
      signOut,
      isLoggedIn,
      getCurrentUser,
    }),
    [
      user,
      error,
      signIn,
      signOut,
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
