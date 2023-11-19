import { authenticateRequest } from "../middlewares/index.js";

import artRouter from "./art.js";
import authRouter from "./auth.js";
import imagesRouter from "./images.js";
import userRouter from "./users.js";

const configureRoutes = (app) => {
  app.use("/api", authRouter);
  app.use("/api/images", imagesRouter);
  app.use("/api/art", authenticateRequest, artRouter);
  app.use("/api/users", authenticateRequest, userRouter);

  app.use("*", (_req, res) => {
    res.status(404).json({ error: "Not found | at *" });
  });
};

export default configureRoutes;