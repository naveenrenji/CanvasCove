import { Router } from "express";
import { userData } from "../data/index.js";
import { formatItemListResponse } from "../utils.js";
import { validateId, validateString } from "../validators/helpers.js";
import xss from "xss";
import { INTERACTION_TYPES } from "../constants.js";

const userRouter = Router();

userRouter.route("/me").get(async (req, res) => {
  try {
    const user = await userData.getUser(req.currentUser, req.currentUser._id);
    return res.json({ user: formatItemResponse(req, user) });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/me").put(async (req, res) => {
  try {
    // TODO: clean and validate body
    const user = await userData.updateCurrentUser(req.currentUser, req.body);
    return res.json({ user: formatItemResponse(req, user) });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/me/liked-art").get(async (req, res) => {
  try {
    const artList = await userData.getMyLikedArt(req.currentUser);
    return res.json({ artList: formatItemListResponse(req, artList, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/search").post(async (req, res) => {
  try {
    const { keyword } = req.body;
    let cleanKeyword = xss(keyword);

    cleanKeyword = validateString(cleanKeyword);

    const users = await userData.searchUsers(req.currentUser, {
      keyword: cleanKeyword,
    });
    return res.json({ users: formatItemListResponse(req, users, "User") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const user = await userData.getUser(req.currentUser, id);
    return res.json({ user: formatItemResponse(req, user) });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id/art").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const artList = await userData.getArtList(req.currentUser, id);
    return res.json({ artList: formatItemListResponse(req, artList, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

export default userRouter;
