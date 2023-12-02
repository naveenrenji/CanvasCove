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
