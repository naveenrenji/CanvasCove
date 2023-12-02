import { USER_ROLES } from "../constants.js";

export default function isArtist(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.currentUser.role !== USER_ROLES.ARTIST) {
    return res.status(403).json({ error: "You are not authorized because you are not an artist!" });
  }

  next();
}
