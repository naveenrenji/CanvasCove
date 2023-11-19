import { Router } from "express";
import xss from "xss";

import { artData } from "../data/index.js";
import { isArtCreator, isArtist } from "../middlewares/index.js";
import { validateId, validateInteractionType } from "../validators/helpers.js";

const artRouter = Router();

artRouter.route("/feed").get(async (req, res) => {
  try {
    const feed = await artData.getFeed(req.currentUser, req?.query?.page || 1);
    return res.json({ feed: formatItemListResponse(req, feed, "Art") });
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
    return res.json({ artList: formatItemListResponse(req, artList, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/").post(isArtist, async (req, res) => {});

artRouter.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const art = await artData.getArt(req.currentUser, id);
    return res.json({ art: formatItemResponse(req, art, "Art") });
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

    const art = await artData.saveArtInteraction(req.currentUser, id, cleanInteractionType);
    return res.json({ art: formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id").put(isArtist, isArtCreator, async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    // TODO: clean and validate body

    const art = await artData.updateArt(req.currentUser, id, req.body);
    return res.json({ art: formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

artRouter.route("/:id").delete(isArtist, isArtCreator, async (req, res) => {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const art = await artData.deleteArt(req.currentUser, id);
    return res.json({ user: formatItemResponse(req, art, "Art") });
  } catch (error) {
    return res.status(error?.status || 500).json({ error: error?.message });
  }
});

export default artRouter;
