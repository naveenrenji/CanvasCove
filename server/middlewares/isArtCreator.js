import { Art } from "../models/index.js";

export default async function isArtCreator(req, res, next) {
  try {
    const { id } = req.params;
    let cleanId = xss(id);
    cleanId = validateId(cleanId);

    const art = await Art.findById(id);
  
    if (!art) {
      return res.status(400).send({ message: "Please provide a valid art id!" });
    }
  
    if (art?.artist?.toString() !== req?.currentUser?._id?.toString()) {
      return res.status(403).send({
        message: "You are not authorized to change this art!",
      });
    }

    next();
  } catch(error) {
    return res.status(500).json({ error: error?.message });
  }
}
