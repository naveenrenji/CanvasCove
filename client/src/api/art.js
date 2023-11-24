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

export const getArtApi = async (artId, forUpdate = false) => {
  const response = await httpInstance.get(`/art/${artId}`, {
    params: { forUpdate },
  });
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

export const createArtApi = async (body) => {
  const response = await httpInstance.post("/art", body);
  return response?.data?.art || {};
};

export const updateArtApi = async (artId, body) => {
  const response = await httpInstance.put(`/art/${artId}`, body);
  return response?.data?.art || {};
};

export const deleteArtApi = async (artId) => {
  const response = await httpInstance.delete(`/art/${artId}`);
  return response?.data?.deleted;
};

export const uploadImageApi = async (artId, image, onUploadProgress) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await httpInstance.post(`/images/Art/${artId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return res.data;
};
