import xss from "xss";
import { Router } from "express";

import { validateEmail, validatePassword } from "../validators/helpers.js";
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
    const { email, password } = req.body;
    let cleanEmail = xss(email);
    let cleanPassword = xss(password);

    cleanEmail = validateEmail(cleanEmail);
    cleanPassword = validatePassword(cleanPassword);

    // TODO: clean and validate other fields

    const user = await auth.createUser({
      email: cleanEmail,
      password: cleanPassword,
    });
    const accesstoken = user.generateToken();

    res.json({ message: "User created successfully", accesstoken });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

export default authRouter;
