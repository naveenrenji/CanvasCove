import mongoose from "mongoose";
import {
  ART_VISIBILITY,
  FEED_LIMIT,
  INTERACTION_TYPES,
  TOP_COMMENTS_COUNT,
} from "../constants.js";
import { Art } from "../models/index.js";
import { validateInteractionType } from "../validators/helpers.js";

export const getFeed = async (currentUser, page = 1) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  let feed;

  const followingUsers = currentUser.following.map((user) => user._id);
  const skipAmount = (page - 1) * FEED_LIMIT;

  try {
    feed = await Art.aggregate([
      {
        $match: {
          artist: { $in: followingUsers },
          isVisible: true,
          visibility: ART_VISIBILITY.PUBLIC,
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.LIKE] },
              },
            },
          },
          viewsCount: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.VIEW] },
              },
            },
          },
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $addFields: {
          recencyInMillis: {
            $subtract: [new Date(), "$createdAt"],
          },
          recencyScore: {
            $divide: [
              1000 * 60 * 60,
              {
                $cond: [
                  { $eq: ["$recencyInMillis", 0] },
                  Number.MAX_SAFE_INTEGER,
                  { $divide: [1, "$recencyInMillis"] },
                ],
              },
            ],
          }, // Recency in hours
          score: {
            $sum: ["$likesCount", "$commentsCount", "$recencyScore"],
          },
        },
      },
      { $sort: { score: -1 } }, // Sort by score, descending
      { $skip: skipAmount }, // Skip the first n results
      { $limit: FEED_LIMIT }, // Limit the number of results
      {
        $addFields: {
          currentUserInteractions: {
            $filter: {
              input: "$interactions",
              as: "interaction",
              cond: { $eq: ["$$interaction.user", currentUser._id] },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $addFields: {
          "artist.isFollowedByCurrentUser": {
            $and: [
              {
                $in: [currentUser._id, "$artist.followers"],
              },
              {
                $in: ["$artist._id", currentUser.following],
              },
            ],
          },
          "artist.isFollowingCurrentUser": {
            $and: [
              {
                $in: [currentUser._id, "$artist.following"],
              },
              {
                $in: ["$artist._id", currentUser.followers],
              },
            ],
          },
        },
      },
      {
        $project: {
          "artist._id": 1,
          "artist.firstName": 1,
          "artist.lastName": 1,
          "artist.displayName": 1,
          "artist.images": 1,
          "artist.isFollowedByCurrentUser": 1,
          "artist.isFollowingCurrentUser": 1,
          currentUserInteractions: 1,
          score: 1,
          priceInCents: 1,
          images: 1,
          title: 1,
          description: 1,
          likesCount: 1,
          viewsCount: 1,
          commentsCount: 1,
          createdAt: 1,
        },
      },
    ]);
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!feed) {
    throw { status: 400, message: "Could not get feed" };
  }

  return feed;
};

// TODO: Implement this and return created art by calling getArt function.
export const createArt = async (currentUser, body) => {};

export const saveArtInteraction = async (
  currentUser,
  artId,
  interactionType
) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!artId) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  if (!interactionType) {
    throw { status: 400, message: "Please provide a valid interaction type!" };
  }

  interactionType = validateInteractionType(interactionType);

  let art;

  try {
    // Get the art and current user interactions
    art = await Art.findById(artId);
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!art) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  const existingInteraction = art.interactions.find(
    (interaction) => interaction.user.toString() === currentUser._id.toString()
  );

  if (!existingInteraction) {
    art.interactions.push({
      user: currentUser._id,
      type: interactionType,
    });
  } else {
    if (interactionType === INTERACTION_TYPES.LIKE) {
      // update interaction with VIEW
      interactionType =
        existingInteraction.type === INTERACTION_TYPES.VIEW
          ? INTERACTION_TYPES.LIKE
          : INTERACTION_TYPES.VIEW;
    } else {
      interactionType = existingInteraction.type;
    }
    art.interactions = art.interactions.map((interaction) => {
      if (interaction.user.toString() === currentUser._id.toString()) {
        interaction.type = interactionType;
      }
      return interaction;
    });
  }

  try {
    await art.save();
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return getArt(currentUser, artId);
};

export const getArtComments = async (currentUser, artId) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!artId) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  let art;

  try {
    // Join with user to get user data.
    const result = await Art.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(artId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: { userIds: "$comments.user" }, // Define the variable for user IDs in comments
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$userIds"] },
              },
            },
            {
              $project: { _id: 1, displayName: 1 }, // Select only _id and displayName
            },
          ],
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 1,
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                comment: "$$comment.comment",
                createdAt: "$$comment.createdAt",
                user: {
                  $first: {
                    $filter: {
                      input: "$userDetails",
                      as: "userDetail",
                      cond: { $eq: ["$$userDetail._id", "$$comment.user"] },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    art = result?.[0];
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!art) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  return art.comments || [];
};

export const createArtComment = async (currentUser, artId, comment) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!artId) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  if (!comment) {
    throw { status: 400, message: "Please provide a valid comment!" };
  }

  let art;

  try {
    art = await Art.findById(artId);
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!art) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  art.comments.push({
    user: currentUser._id,
    comment,
  });

  try {
    await art.save();
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return getArtComments(currentUser, artId);
};

// TODO: Implement this using withMetrics function as it will retrun art metrics, if any.
export const searchArt = async (currentUser, { keyword }) => {};

export const getArt = async (currentUser, artId, forUpdate = false) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!artId) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  let result, art;

  try {
    result = forUpdate
      ? await Art.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(artId),
              artist: currentUser._id,
            },
          },
          {
            $project: {
              _id: 1,
              artist: 1,
              visibility: 1,
              isVisible: 1,
              images: 1,
              title: 1,
              description: 1,
              priceInCents: 1,
              artType: 1,
            },
          },
        ])
      : await Art.withMetrics(currentUser, {
          $match: { _id: new mongoose.Types.ObjectId(artId) },
        });
    art = result?.[0];
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!art) {
    throw { status: 400, message: "Please provide a valid art id!" };
  }

  return art;
};

// TODO: Implement this and call getArt function to return updated art
// DONT USE WITHMETRICS FUNCTION TO FETCH INITIAL ART DATA. ONLY USE IT TO FETCH FINAL UPDATED ART DATA.
// Refer saveArtInteraction function for example.
export const updateArt = async (currentUser, artId, body) => {};

// TODO: Implement this and return boolean if its deleted or not. Make sure images are deleted as well(Call ImageService.deleteImages with art images array)
// DONT USE WITHMETRICS FUNCTION
export const deleteArt = async (currentUser, artId) => {};
