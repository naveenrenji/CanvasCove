import ImageService from "./services/image-service.js";

export const formatItemListResponse = async (req, items, type = 'User') => {
  const result = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    result.push(await formatItemResponse(req, item, type));
  }

  return result;
};

export const formatItemResponse = async (req, item, type = 'User') => {
  const baseUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/images/${type}/${item._id.toString()}/download`;

  return {
    ...item,
    images: await ImageService.getImagesWithUrls(item.images, baseUrl),
  };
};