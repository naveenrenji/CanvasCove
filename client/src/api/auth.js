import httpInstance from "./httpInstance";

export const signUp = async (
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    role,
    gender
  ) => {
    const res = await httpInstance.post("/signup", {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      role,
      gender,
    });
    return res.data;
  };

export const login = async (email, password) => {
    const res = await httpInstance.post("/login", { email, password });
    return res.data;
};
