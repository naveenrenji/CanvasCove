import React from "react";
import { Routes as BrowserRoutes, Outlet, Route } from "react-router-dom";

import Layout from "./Layout";
import AuthHoc from "./AuthHoc";
import Redirector from "./Redirector";
import RequireAuth from "./RequireAuth";

import {
  Art,
  Home,
  Login,
  Signup,
  Welcome,
  EditArt,
  ArtList,
  Explore,
  NotFound,
  CreateArt,
  UserProfile,
  Account,
  UpdateUser,
} from "../components";

const Routes = () => {
  return (
    <BrowserRoutes>
      <Route element={<Layout />}>
        <Route index element={<Redirector />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/update-profile"
          element={
            <RequireAuth>
              <UpdateUser />
            </RequireAuth>
          }
        />
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
        <Route path="/users" element={<Outlet />}>
          <Route
            path=":id"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />
        </Route>

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
        <Route
          path="/explore"
          element={
            <RequireAuth>
              <Explore />
            </RequireAuth>
          }
        />
        <Route path="/account" element={<Outlet />}>
          <Route
            index
            element={
              <RequireAuth>
                <Account />
              </RequireAuth>
            }
          />
          <Route
            path="edit"
            element={
              <RequireAuth>
                <UpdateUser />
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
