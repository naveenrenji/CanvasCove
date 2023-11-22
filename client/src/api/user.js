import httpInstance from "./httpInstance";

export const updateFollowStatusApi = async (userId) => {
  const response = await httpInstance.put(
    `/users/${userId}/update-follow-status`
  );
  return response?.data?.user || {};
};
