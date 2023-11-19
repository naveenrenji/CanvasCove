import User from "../models/user.js";
import {
  validateEmail,
  validatePassword,
} from "../validators/helpers.js";
import xss from "xss";

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

// TODO: Create user from signup process
export const createUser = async ({ email, password, ...more }) => {};
