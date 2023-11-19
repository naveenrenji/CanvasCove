import {
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
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: { $eq: ["$$interaction.type", "like"] },
              },
            },
          },
          totalCommentsCount: { $size: "$comments" },
        },
      },
      {
        $addFields: {
          likesCount: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: { $eq: ["$$interaction.type", "like"] },
              },
            },
          },
          allCommentsCount: { $size: "$comments" },
          recencyHours: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          }, // Recency in hours
        },
      },
      {
        $addFields: {
          recencyScore: {
            $cond: [
              { $eq: ["$recencyHours", 0] },
              Number.MAX_SAFE_INTEGER,
              { $divide: [1, "$recencyHours"] },
            ],
          },
          score: {
            $sum: ["$likesCount", "$allCommentsCount", "$recencyScore"],
          },
        },
      },
      { $sort: { score: -1 } }, // Sort by score, descending
      { $skip: skipAmount }, // Skip the first n results
      { $limit: FEED_LIMIT }, // Limit the number of results
      {
        $addFields: {
          topComments: { $slice: ["$comments", TOP_COMMENTS_COUNT] }, // Get the top 3 comments
        },
      },
      {
        $addFields: {
          commentsCount: {
            $subtract: ["$totalCommentsCount", { $size: "$topComments" }], // Get the count of comments(excluding top 3)
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
        $project: {
          "artist._id": 0,
          "artist.firstName": 1,
          "artist.lastName": 1,
          "artist.email": 1,
          score: 1,
          images: 1,
          title: 1,
          description: 1,
          likesCount: 1,
          commentsCount: 1,
          topComments: 1,
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
    (interaction) => interaction.user.toString === currentUser._id.toString()
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

  return art;
};

export const searchArt = async (currentUser, { keyword }) => {};

export const getArt = async (currentUser, artId) => {};

export const updateArt = async (currentUser, artId, body) => {};

export const deleteArt = async (currentUser, artId) => {};
