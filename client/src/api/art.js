import httpInstance from "./httpInstance";

export const getFeedApi = async (page) => {
  const response = await httpInstance.get("/art/feed", { params: { page } });
  return response?.data?.feed || [];
};

export const interactWithArtApi = async (artId, interactionType) => {
  const response = await httpInstance.post(`/art/${artId}/interact`, {
    type: interactionType,
  });
  return response?.data?.art || {};
};
