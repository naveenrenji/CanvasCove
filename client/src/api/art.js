import httpInstance from "./httpInstance";

export const getFeedApi = async (page, selectedPill) => {
  const response = await httpInstance.get("/art/feed", {
    params: { page, artType: selectedPill === "All" ? null : selectedPill },
  });
  return response?.data?.feed || [];
};

export const getOnFireArtApi = async (page) => {
  const response = await httpInstance.get("/art/on-fire", {
    params: { page },
  });
  return response?.data?.onFireArt || [];
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

export const deleteImagesApi = async (artId, imageIds) => {
  const res = await httpInstance.delete(`/images/Art/${artId}/bulk-delete`, {
    data: { imageIds },
  });

  return res.data;
};

// Search art api with provided search term using POST method
export const searchApi = async (keyword) => {
  const response = await httpInstance.post(`/art/search`, { keyword });
  return response?.data?.artList || [];
};