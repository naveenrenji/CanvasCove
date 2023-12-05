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

  const refreshCurrentUser = useCallback(async () => {
    try {
      const data = await getLoggedInUser();
      setUser(data);
    } catch (error) {
      throw new Error("Could not get your details. Please try again.");
    }
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
      await getCurrentUser();
      await callback();
      setIsLoggedIn(!!accesstoken);
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
      refreshCurrentUser,
    }),
    [
      user,
      error,
      signIn,
      signOut,
      isLoggedIn,
      getCurrentUser,
      refreshCurrentUser,
    ]
  );

  return (
    <AuthContext.Provider value={authValues}>
      {appLoaded ? children : <Loader />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
