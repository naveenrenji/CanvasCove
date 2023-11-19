import httpInstance from "./httpInstance";

export const getFeedApi = async (page) => {
  const response = await httpInstance.get("/art/feed", { params: { page } });
  return response?.data?.feed || [];
};
