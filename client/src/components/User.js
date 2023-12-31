import React, { useEffect, useState } from "react";
import { ArtTabs, UserProfile } from "./common";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { userApi } from "../api";
import { Loader } from "./common";
import { ART_TABS, USER_ROLES } from "../constants";

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // UseEffect to fetch user data
  useEffect(() => {
    // fetch user data
    setLoading(true);
    const fetchUser = async () => {
      try {
        const user = await userApi.getUser(id);
        setUser(user);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);
  return (
    // Show loader if loading, error if error, else show user profile
    <Container fluid="md">
      {loading && <Loader />}
      {error && <p>{error}</p>}
      {user && <UserProfile user={user} onUserChange={setUser} />}
      {user && (
        <ArtTabs
          user={user}
          defaultTab={
            user.role === USER_ROLES.ARTIST
              ? ART_TABS.CREATED_ART
              : ART_TABS.LIKED_ART
          }
        />
      )}
    </Container>
  );
};

export default User;
