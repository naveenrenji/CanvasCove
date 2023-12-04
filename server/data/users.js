import mongoose from "mongoose";
import { Art, User } from "../models/index.js";
import xss from "xss";
import {
  validateDOB,
  validateGender,
  validateString,
} from "../validators/helpers.js";

export const getUser = async (currentUser, userId) => {
  try {
    const user =
      currentUser?._id?.toString() === userId?.toString()
        ? await User.viewCurrentUser(currentUser)
        : await User.view(currentUser, userId);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }
    return user;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
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

export const getUserLikedArt = async (currentUser, userId) => {
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
            user: new mongoose.Types.ObjectId(userId),
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

export const updateCurrentUser = async (currentUser, body) => {
  try {
    const { gender, firstName, lastName, dob, bio } = body;

    let cleanGender = xss(gender);
    cleanGender = validateGender(cleanGender);

    let cleanFirstName = xss(firstName);
    cleanFirstName = validateString(cleanFirstName, "firstName", {
      maxLength: 50,
    });

    let cleanLastName = xss(lastName);
    cleanLastName = validateString(cleanLastName, "lastName", {
      maxLength: 50,
    });

    let cleanBio = xss(bio);
    cleanBio = validateString(cleanBio, "bio", { maxLength: 200 });

    let cleanDob = xss(dob);
    cleanDob = validateDOB(cleanDob, "dob");

    const fieldsToUpdate = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      bio: cleanBio,
      dob: cleanDob,
      gender: cleanGender,
    };

    // Call mongoose update function and pass in the fields to update
    await User.updateOne({ _id: currentUser._id }, fieldsToUpdate);

    return getUser(updatedUser, updatedUser._id);
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const searchUsers = async (currentUser, { keyword, role }) => {
  try {
    // const users = await User.fetch(
    //   currentUser,
    //   [
    //     {
    //       $match: {
    //         $or: [
    //           { firstName: { $regex: keyword, $options: "i" } },
    //           { lastName: { $regex: keyword, $options: "i" } },
    //           { displayName: { $regex: keyword, $options: "i" } },
    //         ],
    //       },
    //     },
    //   ],
    //   { page: 1, limit: 10 }
    // );
    // Get users by role and keyword if provided. Else return all users
    // const users = await User.fetch(
    //   currentUser,
    //   [
    //     {
    //       $match: {
    //         ...(role ? { role } : {}),
    //         $or: [
    //           { firstName: { $regex: keyword, $options: "i" } },
    //           { lastName: { $regex: keyword, $options: "i" } },
    //           { displayName: { $regex: keyword, $options: "i" } },
    //         ],
    //       },
    //     },
    //   ],
    //   { page: 1, limit: 10 }
    // );
    // Get users. Role and keyword are optional. If not provided, return all users
    const users = await User.fetch(
      currentUser,
      [
        {
          $match: {
            ...(role ? { role } : {}),
            ...(typeof keyword === 'string' && keyword
              ? {
                  $or: [
                    { firstName: { $regex: keyword, $options: "i" } },
                    { lastName: { $regex: keyword, $options: "i" } },
                    { displayName: { $regex: keyword, $options: "i" } },
                  ],
                }
              : {}),
          },
        },
      ],
      { page: 1, limit: 10 }
    );
    return users;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
  }
};

// Method to getUsers - return all if userType not mentioned
export const getUsers = async (currentUser, { role }) => {
  try {
    const users = await User.fetch(
      currentUser,
      [
        {
          $match: {
            ...(role ? { role } : {}),
          },
        },
      ],
      { page: 1, limit: 10 }
    );
    return users;
  } catch (error) {
    throw {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    };
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
  const updatedUser = await User.view(currentUser, userId);

  if (!updatedUser) {
    throw { status: 400, message: "Could not get user" };
  }

  return updatedUser;
};
