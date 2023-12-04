import { Router } from "express";
import { userData } from "../data/index.js";
import { formatItemListResponse, formatItemResponse } from "../utils.js";
import {
  validateId,
  validateString,
  validateRole,
} from "../validators/helpers.js";

import xss from "xss";

const userRouter = Router();

userRouter.route("/me").get(async (req, res) => {
  try {
    const user = await userData.getUser(req.currentUser, req.currentUser._id);
    return res.json({
      user: await formatItemResponse(req, user),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

// userRouter.route("/me").put(async (req, res) => {
//   try {
//     const user = await userData.updateCurrentUser(req.currentUser, req.body);
//     return res.json({ user: await formatItemResponse(req, user) });
//   } catch (error) {
//     return res.status(error?.status || 500).json({ error: error?.message });
//   }
// });

userRouter.route("/:id/following").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const users = await userData.getFollowingUsers(req.currentUser, cleanId);
    return res.json({
      following: await formatItemListResponse(req, users),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id/followers").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const users = await userData.getFollowers(req.currentUser, cleanId);
    return res.json({
      followers: await formatItemListResponse(req, users),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id/liked-art").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const artList = await userData.getUserLikedArt(req.currentUser, cleanId);
    return res.json({
      artList: await formatItemListResponse(req, artList, "Art"),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/search").post(async (req, res) => {
  try {
    const { keyword, role } = req.body;
    let cleanKeyword = xss(keyword);
    let cleanRole = xss(role);

    const payload = {};
    if (cleanKeyword) {
      payload.keyword = validateString(cleanKeyword);
    }
    if (cleanRole) {
      payload.role = validateRole(cleanRole);
    }

    const users = await userData.searchUsers(req.currentUser, payload);
    return res.json({
      users: await formatItemListResponse(req, users, "User"),
    });
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
    return res.json({ user: await formatItemResponse(req, user) });
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
    return res.json({
      artList: await formatItemListResponse(req, artList, "Art"),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id/update-follow-status").put(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const user = await userData.updateFollowingStatus(req.currentUser, id);
    return res.json({ user: await formatItemResponse(req, user, "User") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

userRouter.route("/:id/update").put(async (req, res) => {
  try {
    const { id } = req.params;

    if (req.currentUser?._id?.toString() !== id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedUser = await userData.updateCurrentUser(req.currentUser, req.body);
    res.json({ user: formatItemResponse(req, updatedUser) });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

export default userRouter;
