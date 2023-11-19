import { USER_ROLES } from "../constants";

export default function isArtist(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.currentUser.role !== USER_ROLES.ARTIST) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}
