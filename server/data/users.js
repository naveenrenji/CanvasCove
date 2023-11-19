import { INTERACTION_TYPES } from "../constants";

export const getUser = async (currentUser, userId) => {
  // TODO: Get user and images
  return currentUser;
};

export const getArtList = async (currentUser, userId) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!userId) {
    throw { status: 400, message: "Please provide a valid user id!" };
  }

  let artList;

  try {
    // Get the art and current user interactions
    artList = await Art.find({ artist: userId });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return artList;
};

export const getMyLikedArt = async (currentUser) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  let artList;

  try {
    // Get the art which the current user has liked
    artList = await Art.find({
      "interactions.user": currentUser._id,
      "interactions.type": INTERACTION_TYPES.LIKE,
    });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return artList;
}

export const updateCurrentUser = async (currentUser, body) => {};