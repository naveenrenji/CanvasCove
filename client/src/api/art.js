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

export const getArtApi = async (artId) => {
  const response = await httpInstance.get(`/art/${artId}`);
  return response?.data?.art || {};
};

export const getArtCommentsApi = async (artId) => {
  const response = await httpInstance.get(`/art/${artId}/comments`);
  return response?.data?.comments || [];
};

export const createCommentApi = async (artId, body) => {
  const response = await httpInstance.post(`/art/${artId}/comments`, body);
  return response?.data?.comments || [];
};
