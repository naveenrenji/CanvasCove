import mongoose from "mongoose";
import { Art, User } from "../models/index.js";

export const getUser = async (currentUser, userId) => {
  try {
    // TODO: Get if the user is being followed by the current user and if the current user is being followed by the user
    // Refer: updateFollowingStatus function
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    let artQuery = {};
    if (user.role === USER_ROLES.ARTIST) {
      artQuery = { artist: user._id };
    } else {
      artQuery = {
        interactions: {
          $elemMatch: {
            user: new mongoose.Types.ObjectId(user._id),
            type: "like",
          },
        },
      };
    }

    // TODO: You can simply use getArtList or getMyLikedArt functions here. Add a new limit parameter to those function.
    // TODO: Update the withMetrics function to accept a limit parameter(only if available) and use it in the aggregation pipeline.
    const artList = await Art.find(artQuery).limit(5);
    // TODO: This is good, but you have to update the route accordingly. Check and update get users/me and users/:id routes.
    return { user, artList };
  } catch (error) {
    throw { status: error.status || 500, message: error.message || "Internal Server Error" };
  }
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

// TODO: BODY SHOULD BE VALIDATED
// TODO: Can only update firstName, lastName, dob, bio and gender. Update this accordingly.
// TODO: Cannot create new user if not available. It should throw an error.
export const updateCurrentUser = async (currentUser, body) => {
  try {
    // Assuming you want to prevent updating certain fields like 'role' or 'encryptedPassword'
    const fieldsToUpdate = { ...body };
    delete fieldsToUpdate.role;
    delete fieldsToUpdate.encryptedPassword;

    const updatedUser = await User.findByIdAndUpdate(currentUser._id, fieldsToUpdate, { new: true });
    if (!updatedUser) {
      throw { status: 404, message: "User not found" };
    }
    return getUser(updatedUser, updatedUser._id);
  } catch (error) {
    throw { status: error.status || 500, message: error.message || "Internal Server Error" };
  }
};

// TODO: Also send if users are being followed by current user. Refer: updateFollowingStatus function
// If a pattern emerges for this, you can move it to a separate user `withMetrics` model function(like witMetrics in Art model))
export const searchUsers = async (currentUser, { keyword }) => {
  try {
    const searchQuery = { $or: [
      { firstName: { $regex: keyword, $options: 'i' } },
      { lastName: { $regex: keyword, $options: 'i' } },
      { displayName: { $regex: keyword, $options: 'i' } }
    ]};
    const users = await User.find(searchQuery);
    return users;
  } catch (error) {
    throw { status: error.status || 500, message: error.message || "Internal Server Error" };
  }
};

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
