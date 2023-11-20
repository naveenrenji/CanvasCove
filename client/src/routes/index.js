import React from "react";
import { Routes as BrowserRoutes, Route } from "react-router-dom";

import Layout from "./Layout";
import AuthHoc from "./AuthHoc";
import Redirector from "./Redirector";
import RequireAuth from "./RequireAuth";

import {
    Home,
    Login,
    Signup,
    Welcome,
    NotFound
} from "../components";

const Routes = () => {
  return (
    <BrowserRoutes>
      <Route element={<Layout />}>
        <Route index element={<Redirector />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/login"
          element={
            <AuthHoc>
              <Login />
            </AuthHoc>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthHoc>
              <Signup />
            </AuthHoc>
          }
        />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </BrowserRoutes>
  );
};

export default Routes;