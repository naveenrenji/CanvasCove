import authRouter from "./auth.js";
import imagesRouter from "./images.js";

const configureRoutes = (app) => {
  app.use("/api", authRouter);
  app.use("/api/images", imagesRouter);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found | at *" });
  });
};

export default configureRoutes;