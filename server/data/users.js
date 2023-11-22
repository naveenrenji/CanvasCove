import mongoose from "mongoose";
import { Art, User } from "../models/index.js";

// TODO: Get user and his images.
// If user is artist, get his art as well. Else get users liked art. limit to latest 5
export const getUser = async (currentUser, userId) => {
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
    artList = await Art.withMetrics(currentUser, {
      $match: { artist: new mongoose.Types.ObjectId(userId) },
    });
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
    artList = await Art.withMetrics(currentUser, {
      $match: {
        interactions: {
          $elemMatch: {
            user: new mongoose.Types.ObjectId(currentUser._id),
            type: "like",
          },
        },
      },
    });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return artList;
};

// TODO: Update current user and respond with updated user by calling getUser function.
export const updateCurrentUser = async (currentUser, body) => {};

// TODO: Implement search users
export const searchUsers = async (currentUser, { keyword }) => {};

export const updateFollowingStatus = async (currentUser, userId) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!userId) {
    throw { status: 400, message: "Please provide a valid user id!" };
  }

  let user;

  try {
    user = await User.findById(userId);
    currentUser = await User.findById(currentUser._id);
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!user) {
    throw { status: 400, message: "Please provide a valid user id!" };
  }

  const isFollowing =
    currentUser.following?.find(
      (follower) => follower.toString() === userId.toString()
    ) &&
    user.followers?.find(
      (following) => following.toString() === currentUser._id.toString()
    );

  if (isFollowing) {
    currentUser.following = currentUser.following.filter(
      (follower) => follower.toString() !== userId.toString()
    );
    user.followers = user.followers.filter(
      (following) => following.toString() !== currentUser._id.toString()
    );
  } else {
    currentUser.following ||= [];
    user.followers ||= [];

    currentUser.following.push(userId);
    user.followers.push(currentUser._id);
  }

  try {
    await currentUser.save();
    await user.save();
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  // Fetch user data and also add if current user is following as one of the keys
  const result = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $addFields: {
        isFollowedByCurrentUser: {
          $and: [
            {
              $in: [currentUser._id, "$followers"],
            },
            {
              $in: ["$_id", currentUser.following],
            },
          ],
        },
        isFollowingCurrentUser: {
          $and: [
            {
              $in: [currentUser._id, "$following"],
            },
            {
              $in: ["$_id", currentUser.followers],
            },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        displayName: 1,
        images: 1,
        isFollowedByCurrentUser: 1,
        isFollowingCurrentUser: 1,
      },
    },
  ]);

  if (!result || !result?.[0]) {
    throw { status: 400, message: "Could not get user" };
  }

  return result[0];
};
