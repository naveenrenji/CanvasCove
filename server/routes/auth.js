import xss from "xss";
import { Router } from "express";

import { validateEmail, validatePassword, validateSignUp } from "../validators/helpers.js";
import { auth } from "../data/index.js";

const authRouter = Router();

authRouter.route("/login").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    let cleanEmail = xss(email);
    let cleanPassword = xss(password);

    cleanEmail = validateEmail(cleanEmail);
    cleanPassword = validatePassword(cleanPassword);

    const user = await auth.login(cleanEmail, cleanPassword);
    const accesstoken = user.generateToken();

    res.json({ message: "Login successful", accesstoken });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

authRouter.route("/sign-up").post(async (req, res) => {
  try {
    let { displayName, firstName, lastName, email, dob, role, gender, password } = req.body;
    displayName = xss(displayName)
    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    password = xss(password);
    dob = xss(dob);
    role = xss(role);
    gender = xss(gender);

    let signupPayload = validateSignUp({
      displayName, firstName, lastName, email, password, dob, role, gender
    });

    const user = await auth.signup(signupPayload);
    const accesstoken = user.generateToken();

    res.json({ message: "User created successfully", accesstoken });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

export default authRouter;
