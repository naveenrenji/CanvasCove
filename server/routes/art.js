import { Router } from "express";
import xss from "xss";

import { artData } from "../data/index.js";
import { isArtCreator, isArtist } from "../middlewares/index.js";
import {
  validateId,
  validateInteractionType,
  validateString,
} from "../validators/helpers.js";
import { formatItemListResponse, formatItemResponse } from "../utils.js";

const artRouter = Router();

artRouter.route("/feed").get(async (req, res) => {
  try {
    const feed = await artData.getFeed(req.currentUser, req?.query?.page || 1);
    return res.json({ feed: await formatItemListResponse(req, feed, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/search").post(async (req, res) => {
  try {
    const { keyword } = req.body;
    let cleanKeyword = xss(keyword);

    cleanKeyword = validateString(cleanKeyword);

    const artList = await artData.searchArt(req.currentUser, {
      keyword: cleanKeyword,
    });
    return res.json({
      artList: await formatItemListResponse(req, artList, "Art"),
    });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/").post(isArtist, async (req, res) => {
  try {
    const createdArt = await artData.createArt(req.currentUser, req.body);
    return res.json({ art: await formatItemResponse(req, createdArt, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId, "Art ID");

    let { forUpdate } = req.query;

    if (typeof forUpdate === "string") {
      forUpdate = forUpdate.toLowerCase() === "true";
    }

    const art = await artData.getArt(req.currentUser, id, forUpdate || false);
    return res.json({ art: await formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id/interact").post(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const { type: interactionType } = req.body;
    let cleanInteractionType = xss(interactionType);
    cleanInteractionType = validateInteractionType(cleanInteractionType);

    const art = await artData.saveArtInteraction(
      req.currentUser,
      id,
      cleanInteractionType
    );
    return res.json({ art: await formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id/comments").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const comments = await artData.getArtComments(req.currentUser, id);
    return res.json({ comments });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id/comments").post(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const { comment } = req.body;
    let cleanComment = xss(comment);
    cleanComment = validateString(cleanComment, "comment", { maxLength: 200 });

    const comments = await artData.createArtComment(
      req.currentUser,
      id,
      comment
    );
    return res.json({ comments });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id").put(isArtist, isArtCreator, async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const art = await artData.updateArt(req.currentUser, id, req.body);
    return res.json({ art: await formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id").delete(isArtist, isArtCreator, async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    await artData.deleteArt(req.currentUser, id);
    return res.json({ deleted: true });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

export default artRouter;
