import { Art, User } from "../models/index.js";

const validateImageRoutes = async (req, res, next) => {
  try {
    const { imageableType, imageableId } = req.params;

    if (imageableType === undefined || imageableId === undefined) {
      return res
        .status(400)
        .send({ message: "Please provide a imageableType and id!" });
    }

    if (imageableType !== "User" && imageableType !== "Art") {
      return res
        .status(400)
        .send({ message: "Please provide a valid imageableType!" });
    }

    if (imageableType === "User") {
      const user = await User.findById(imageableId);

      if (!user) {
        return res
          .status(400)
          .send({ message: "Please provide a valid user id!" });
      }

      if (user._id.toString() !== req.currentUser._id.toString()) {
        return res.status(403).send({
          message: "You are not authorized to upload images for this user!",
        });
      }

      req.imageable = { record: user, imageableType, imageableId: user._id };
    }

    if (imageableType === "Art") {
      const art = await Art.findById(imageableId);

      if (!art) {
        return res
          .status(400)
          .send({ message: "Please provide a valid art id!" });
      }

      if (art.userId.toString() !== req.currentUser._id.toString()) {
        return res.status(403).send({
          message: "You are not authorized to upload images for this art!",
        });
      }

      req.imageable = { record: art, imageableType, imageableId: art._id };
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

export const downloadImageRoutes = async (req, res, next) => {
  try {
    const { imageableType, imageableId } = req.params;

    if (imageableType === undefined || imageableId === undefined) {
      return res
        .status(400)
        .send({ message: "Please provide a imageableType and id!" });
    }

    if (imageableType !== "User" && imageableType !== "Art") {
      return res
        .status(400)
        .send({ message: "Please provide a valid imageableType!" });
    }

    if (imageableType === "User") {
      const user = await User.findById(imageableId);

      if (!user) {
        return res
          .status(400)
          .send({ message: "Please provide a valid user id!" });
      }

      req.imageable = { record: user, imageableType, imageableId: user._id };
    }

    if (imageableType === "Art") {
      const art = await Art.findById(imageableId);

      if (!art) {
        return res
          .status(400)
          .send({ message: "Please provide a valid art id!" });
      }

      req.imageable = { record: art, imageableType, imageableId: art._id };
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
};

export default validateImageRoutes;
