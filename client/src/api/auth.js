import httpInstance from "./httpInstance";

export const signUp = async (
  displayName,
  firstName,
  lastName,
  email,
  dob,
  role,
  gender,
  password
  ) => {
    const res = await httpInstance.post("/sign-up", {
      displayName,
      firstName,
      lastName,
      email,
      dob,
      role,
      gender,
      password
    });
    return res.data;
  };

export const login = async (email, password) => {
    const res = await httpInstance.post("/login", { email, password });
    return res.data;
};

export const getLoggedInUser = async () => {
  const res = await httpInstance.get("/users/me");
  return res.data?.user;
};
