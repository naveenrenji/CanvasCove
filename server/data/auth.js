import User from "../models/user.js";
import {
  validateEmail,
  validateSignUp,
  validatePassword,
} from "../validators/helpers.js";
import xss from "xss";
import PasswordService from "../services/password-service.js";

export const getLoggedInUser = async(email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 401, message: "Could not find the user associated with the login credentials"};
    };
    return user;
  } catch (error) {
    throw { status: 401, message: error?.message };
  };
};
export const login = async (email, password) => {
  email = xss(email);
  password = xss(password);

  email = validateEmail(email);
  password = validatePassword(password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const isPasswordCorrect = await user.verifyPassword(password);

    if (!isPasswordCorrect) {
      throw { status: 401, message: "Invalid credentials" };
    }

    return user;
  } catch (error) {
    throw { status: 401, message: error?.message };
  }
};

export const signup = async (payload) => {
  let signupPayload = validateSignUp(payload);
  const userExists = await User.findOne({ email: signupPayload.email });
  if (userExists) {
    throw { status: 400, message: "User already exists" };
  };
  const displayNameExists = await User.findOne({ displayName: signupPayload.displayName });
  if (displayNameExists) {
    throw { status: 400, message: "Display name already exists. Should be unique." };
  };

  try {
    const encryptedPassword = await new PasswordService(
      xss(signupPayload.password)
    ).encrypt();
    const user = await User.create({
      displayName: xss(signupPayload.displayName),
      firstName: xss(signupPayload.firstName),
      lastName: xss(signupPayload.lastName),
      email: xss(signupPayload.email),
      encryptedPassword: encryptedPassword,
      dob: new Date(xss(signupPayload.dob)),
      role: xss(signupPayload.role),
      gender: xss(signupPayload.gender),
    });

    return user;
  } catch (error) {
    throw { status: 400, message: error?.message };
  }
};
