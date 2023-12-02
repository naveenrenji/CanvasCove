import React from "react";
import { Routes as BrowserRoutes, Outlet, Route } from "react-router-dom";

import Layout from "./Layout";
import AuthHoc from "./AuthHoc";
import Redirector from "./Redirector";
import RequireAuth from "./RequireAuth";

import {
  Home,
  Login,
  Signup,
  Welcome,
  NotFound,
  Art,
  CreateArt,
  EditArt,
  ArtList,
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
        <Route path="/art" element={<Outlet />}>
          <Route
            index
            element={
              <RequireAuth>
                <ArtList />
              </RequireAuth>
            }
          />
          <Route
            path=":id"
            element={
              <RequireAuth>
                <Art />
              </RequireAuth>
            }
          />
          <Route
            path=":id/edit"
            element={
              <RequireAuth>
                <EditArt />
              </RequireAuth>
            }
          />
          <Route
            path="create"
            element={
              <RequireAuth>
                <CreateArt />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </BrowserRoutes>
  );
};

export default Routes;
