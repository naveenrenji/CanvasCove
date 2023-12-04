import httpInstance from "./httpInstance";

export const updateFollowStatusApi = async (userId) => {
  const response = await httpInstance.put(
    `/users/${userId}/update-follow-status`
  );
  return response?.data?.user || {};
};

export const getLikedArt = async (userId) => {
  const response = await httpInstance.get(`/users/${userId}/liked-art`);
  return response?.data?.artList || [];
};

export const getArtList = async (userId) => {
  const response = await httpInstance.get(`/users/${userId}/art`);
  return response?.data?.artList || [];
};

// Search user with provided search term
export const searchApi = async (payload) => {
  const response = await httpInstance.post(`/users/search`, payload);
  return response?.data?.users || [];
};


export const updateUserApi = async (userId, updateData) => {
  const response = await httpInstance.put(`/users/${userId}/update`, updateData);
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await httpInstance.get(`/users/${userId}/followers`);
  return response?.data?.followers || [];
};

export const getFollowing = async (userId) => {
  const response = await httpInstance.get(`/users/${userId}/following`);
  return response?.data?.following || [];
};

// Get user by id
export const getUser = async (userId) => {
  const response = await httpInstance.get(`/users/${userId}`);
  return response?.data?.user || {};
};
