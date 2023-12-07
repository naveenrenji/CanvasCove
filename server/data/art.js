// import mongoose from "mongoose";
// import {
//   ART_VISIBILITY,
//   FEED_LIMIT,
//   INTERACTION_TYPES,
//   ON_FIRE_ART_LIMIT,
//   USER_ROLES,
// } from "../constants.js";
// import { Art } from "../models/index.js";
// import {
//   checkBoolean,
//   validateInteractionType,
//   validateNumber,
//   validateString,
// } from "../validators/helpers.js";
// import ImageService from "../services/image-service.js";
// import xss from "xss";

// export const getFeed = async (currentUser, { page = 1, artType }) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   let feed;

//   const followingUsers = currentUser.following.map((user) => user._id);
//   if (currentUser.role === USER_ROLES.ARTIST) {
//     followingUsers.push(currentUser._id);
//   }
//   const skipAmount = (page - 1) * FEED_LIMIT;

//   try {
//     feed = await Art.aggregate([
//       {
//         $match: {
//           artist: { $in: followingUsers },
//           isVisible: true,
//           visibility: ART_VISIBILITY.PUBLIC,
//           ...(artType ? { artType } : {}),
//         },
//       },
//       {
//         $addFields: {
//           likesCount: {
//             $size: {
//               $filter: {
//                 input: "$interactions",
//                 as: "interaction",
//                 cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.LIKE] },
//               },
//             },
//           },
//           viewsCount: {
//             $size: {
//               $filter: {
//                 input: "$interactions",
//                 as: "interaction",
//                 cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.VIEW] },
//               },
//             },
//           },
//           commentsCount: { $size: "$comments" },
//         },
//       },
//       {
//         $addFields: {
//           recencyInMillis: {
//             $subtract: [new Date(), "$createdAt"],
//           },
//           recencyScore: {
//             $divide: [
//               1000 * 60 * 60,
//               {
//                 $cond: [
//                   { $eq: ["$recencyInMillis", 0] },
//                   Number.MAX_SAFE_INTEGER,
//                   { $divide: [1, "$recencyInMillis"] },
//                 ],
//               },
//             ],
//           }, // Recency in hours
//           score: {
//             $sum: ["$likesCount", "$commentsCount", "$recencyScore"],
//           },
//         },
//       },
//       { $sort: { score: -1 } }, // Sort by score, descending
//       { $skip: skipAmount }, // Skip the first n results
//       { $limit: FEED_LIMIT }, // Limit the number of results
//       {
//         $addFields: {
//           currentUserInteractions: {
//             $filter: {
//               input: "$interactions",
//               as: "interaction",
//               cond: { $eq: ["$$interaction.user", currentUser._id] },
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "artist",
//           foreignField: "_id",
//           as: "artist",
//         },
//       },
//       { $unwind: "$artist" },
//       {
//         $addFields: {
//           "artist.isFollowedByCurrentUser": {
//             $and: [
//               {
//                 $in: [currentUser._id, "$artist.followers"],
//               },
//               {
//                 $in: ["$artist._id", currentUser.following],
//               },
//             ],
//           },
//           "artist.isFollowingCurrentUser": {
//             $and: [
//               {
//                 $in: [currentUser._id, "$artist.following"],
//               },
//               {
//                 $in: ["$artist._id", currentUser.followers],
//               },
//             ],
//           },
//         },
//       },
//       {
//         $project: {
//           "artist._id": 1,
//           "artist.firstName": 1,
//           "artist.lastName": 1,
//           "artist.displayName": 1,
//           "artist.images": 1,
//           "artist.isFollowedByCurrentUser": 1,
//           "artist.isFollowingCurrentUser": 1,
//           currentUserInteractions: 1,
//           score: 1,
//           priceInCents: 1,
//           images: 1,
//           title: 1,
//           description: 1,
//           likesCount: 1,
//           viewsCount: 1,
//           commentsCount: 1,
//           createdAt: 1,
//         },
//       },
//     ]);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!feed) {
//     throw { status: 400, message: "Could not get feed" };
//   }

//   return feed;
// };

// export const getOnFireArt = async (currentUser, { page = 1 }) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }
//   const skipAmount = (page - 1) * ON_FIRE_ART_LIMIT;

//   let onFireArt;

//   try {
//     onFireArt = await Art.aggregate([
//       {
//         $match: {
//           // added in last 24 hours
//           createdAt: {
//             $gte: new Date(new Date() - 24 * 60 * 60 * 1000),
//           },
//           isVisible: true,
//           visibility: ART_VISIBILITY.PUBLIC,
//         },
//       },
//       {
//         $addFields: {
//           likesCount: {
//             $size: {
//               $filter: {
//                 input: "$interactions",
//                 as: "interaction",
//                 cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.LIKE] },
//               },
//             },
//           },
//           viewsCount: {
//             $size: {
//               $filter: {
//                 input: "$interactions",
//                 as: "interaction",
//                 cond: { $eq: ["$$interaction.type", INTERACTION_TYPES.VIEW] },
//               },
//             },
//           },
//           commentsCount: { $size: "$comments" },
//         },
//       },
//       {
//         $addFields: {
//           recencyInMillis: {
//             $subtract: [new Date(), "$createdAt"],
//           },
//           recencyScore: {
//             $divide: [
//               1000 * 60 * 60,
//               {
//                 $cond: [
//                   { $eq: ["$recencyInMillis", 0] },
//                   Number.MAX_SAFE_INTEGER,
//                   { $divide: [1, "$recencyInMillis"] },
//                 ],
//               },
//             ],
//           }, // Recency in hours
//           score: {
//             $sum: ["$likesCount", "$commentsCount", "$recencyScore"],
//           },
//         },
//       },
//       { $sort: { score: -1 } }, // Sort by score, descending
//       { $skip: skipAmount }, // Skip the first n results
//       { $limit: FEED_LIMIT }, // Limit the number of results
//       {
//         $addFields: {
//           currentUserInteractions: {
//             $filter: {
//               input: "$interactions",
//               as: "interaction",
//               cond: { $eq: ["$$interaction.user", currentUser._id] },
//             },
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "artist",
//           foreignField: "_id",
//           as: "artist",
//         },
//       },
//       { $unwind: "$artist" },
//       {
//         $addFields: {
//           "artist.isFollowedByCurrentUser": {
//             $and: [
//               {
//                 $in: [currentUser._id, "$artist.followers"],
//               },
//               {
//                 $in: ["$artist._id", currentUser.following],
//               },
//             ],
//           },
//           "artist.isFollowingCurrentUser": {
//             $and: [
//               {
//                 $in: [currentUser._id, "$artist.following"],
//               },
//               {
//                 $in: ["$artist._id", currentUser.followers],
//               },
//             ],
//           },
//         },
//       },
//       {
//         $project: {
//           "artist._id": 1,
//           "artist.firstName": 1,
//           "artist.lastName": 1,
//           "artist.displayName": 1,
//           "artist.images": 1,
//           "artist.isFollowedByCurrentUser": 1,
//           "artist.isFollowingCurrentUser": 1,
//           currentUserInteractions: 1,
//           score: 1,
//           priceInCents: 1,
//           images: 1,
//           title: 1,
//           description: 1,
//           likesCount: 1,
//           viewsCount: 1,
//           commentsCount: 1,
//           createdAt: 1,
//         },
//       },
//     ]);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!onFireArt) {
//     throw { status: 400, message: "Could not get onFireArt" };
//   }

//   return onFireArt;
// };

// export const createArt = async (currentUser, body) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!body) {
//     throw { status: 400, message: "Please provide a valid art body!" };
//   }

//   let art;

//   const fieldsToCreate = validateArtBody(body);

//   try {
//     art = await Art.create({
//       ...fieldsToCreate,
//       artist: currentUser._id,
//     });
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   return getArt(currentUser, art._id);
// };

// export const saveArtInteraction = async (
//   currentUser,
//   artId,
//   interactionType
// ) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!artId) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   if (!interactionType) {
//     throw { status: 400, message: "Please provide a valid interaction type!" };
//   }

//   interactionType = validateInteractionType(interactionType);

//   let art;

//   try {
//     // Get the art and current user interactions
//     art = await Art.findById(artId);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   const existingInteraction = art.interactions.find(
//     (interaction) => interaction.user.toString() === currentUser._id.toString()
//   );

//   if (!existingInteraction) {
//     art.interactions.push({
//       user: currentUser._id,
//       type: interactionType,
//     });
//   } else {
//     if (interactionType === INTERACTION_TYPES.LIKE) {
//       // update interaction with VIEW
//       interactionType =
//         existingInteraction.type === INTERACTION_TYPES.VIEW
//           ? INTERACTION_TYPES.LIKE
//           : INTERACTION_TYPES.VIEW;
//     } else {
//       interactionType = existingInteraction.type;
//     }
//     art.interactions = art.interactions.map((interaction) => {
//       if (interaction.user.toString() === currentUser._id.toString()) {
//         interaction.type = interactionType;
//       }
//       return interaction;
//     });
//   }

//   try {
//     await art.save();
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   return getArt(currentUser, artId);
// };

// export const getArtComments = async (currentUser, artId) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!artId) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   let art;

//   try {
//     // Join with user to get user data.
//     const result = await Art.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(artId),
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           let: { userIds: "$comments.user" }, // Define the variable for user IDs in comments
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $in: ["$_id", "$$userIds"] },
//               },
//             },
//             {
//               $project: { _id: 1, displayName: 1 }, // Select only _id and displayName
//             },
//           ],
//           as: "userDetails",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           comments: {
//             $map: {
//               input: "$comments",
//               as: "comment",
//               in: {
//                 _id: "$$comment._id",
//                 comment: "$$comment.comment",
//                 createdAt: "$$comment.createdAt",
//                 user: {
//                   $first: {
//                     $filter: {
//                       input: "$userDetails",
//                       as: "userDetail",
//                       cond: { $eq: ["$$userDetail._id", "$$comment.user"] },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     ]);

//     art = result?.[0];
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   return art.comments || [];
// };

// export const createArtComment = async (currentUser, artId, comment) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!artId) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   if (!comment) {
//     throw { status: 400, message: "Please provide a valid comment!" };
//   }

//   let art;

//   try {
//     art = await Art.findById(artId);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   art.comments.push({
//     user: currentUser._id,
//     comment,
//   });

//   try {
//     await art.save();
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   return getArtComments(currentUser, artId);
// };

// export const searchArt = async (currentUser, { keyword }) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!keyword) {
//     throw { status: 400, message: "Please provide a valid keyword!" };
//   }

//   let result;

//   try {
//     result = await Art.withMetrics(currentUser, {
//       $match: {
//         $or: [
//           { title: { $regex: keyword, $options: "i" } },
//           { description: { $regex: keyword, $options: "i" } },
//         ],
//         isVisible: true,
//         visibility: ART_VISIBILITY.PUBLIC,
//       },
//     });
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!result) {
//     throw { status: 400, message: "Could not get art" };
//   }

//   return result;
// };

// export const getArt = async (currentUser, artId, forUpdate = false) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!artId) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   let result, art;

//   try {
//     result = forUpdate
//       ? await Art.aggregate([
//           {
//             $match: {
//               _id: new mongoose.Types.ObjectId(artId?.toString()),
//               artist: currentUser._id,
//             },
//           },
//           {
//             $lookup: {
//               from: "images",
//               let: { imageIds: "$images" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: { $in: ["$_id", "$$imageIds"] },
//                   },
//                 },
//               ],
//               as: "images",
//             },
//           },
//           {
//             $project: {
//               _id: 1,
//               artist: 1,
//               visibility: 1,
//               isVisible: 1,
//               images: 1,
//               title: 1,
//               description: 1,
//               priceInCents: 1,
//               artType: 1,
//             },
//           },
//         ])
//       : await Art.withMetrics(currentUser, {
//           $match: {
//             _id: new mongoose.Types.ObjectId(artId),
//             isVisible: true,
//           },
//         });
//     art = result?.[0];
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   return art;
// };

// export const updateArt = async (currentUser, artId, body) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!body) {
//     throw { status: 400, message: "Please provide a valid art body!" };
//   }

//   let art;

//   try {
//     art = await Art.findById(artId);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   if (!art?.artist?.toString() === currentUser?._id?.toString()) {
//     throw { status: 400, message: "You can't update this art!" };
//   }

//   const fieldsToUpdate = validateArtBody(body);

//   try {
//     // Update without loosing other information
//     await Art.updateOne({ _id: artId }, { $set: fieldsToUpdate });
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   return getArt(currentUser, art._id);
// };

// export const deleteArt = async (currentUser, artId) => {
//   if (!currentUser) {
//     throw { status: 401, message: "Unauthorised request" };
//   }

//   if (!artId) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   let art;

//   try {
//     art = await Art.findById(artId);
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   if (!art) {
//     throw { status: 400, message: "Please provide a valid art id!" };
//   }

//   if (!art?.artist?.toString() === currentUser?._id?.toString()) {
//     throw { status: 400, message: "You can't delete this art!" };
//   }

//   try {
//     await ImageService.deleteImages({
//       images: await Image.find({
//         _id: { $in: art.images },
//       }),
//       imageableType: "Art",
//       imageableId: art._id,
//     });

//     await art.delete();
//   } catch (error) {
//     throw { status: 400, message: error.toString() };
//   }

//   return true;
// };

// const validateArtBody = (body) => {
//   const { title, description, artType, priceInCents, visibility, isVisible } =
//     body;

//   let cleanTitle = xss(title);
//   cleanTitle = validateString(cleanTitle, "Title");

//   let cleanDescription = xss(description);
//   cleanDescription = validateString(cleanDescription, "Description");

//   let cleanArtType = xss(artType);
//   cleanArtType = validateString(cleanArtType, "Art Type");

//   let cleanPriceInCents = xss(priceInCents);
//   cleanPriceInCents = Number(cleanPriceInCents);
//   cleanPriceInCents = validateNumber(cleanPriceInCents, "Price");

//   let cleanVisibility = xss(visibility);
//   cleanVisibility = validateString(cleanVisibility, "Visibility");

//   let cleanIsVisible = isVisible;
//   if (!checkBoolean(cleanIsVisible)) {
//     throw { status: 400, message: "Please provide a valid isVisible!" };
//   }

//   return {
//     title: cleanTitle,
//     description: cleanDescription,
//     artType: cleanArtType,
//     priceInCents: cleanPriceInCents,
//     visibility: cleanVisibility,
//     isVisible: cleanIsVisible,
//   };
// };


import mongoose, { now } from "mongoose";
import {
  ART_VISIBILITY,
  FEED_LIMIT,
  INTERACTION_TYPES,
  ON_FIRE_ART_LIMIT,
  USER_ROLES,
} from "../constants.js";
import { Art } from "../models/index.js";
import {
  checkBoolean,
  validateInteractionType,
  validateNumber,
  validateString,
} from "../validators/helpers.js";
import ImageService from "../services/image-service.js";
import xss from "xss";

export const getFeed = async (currentUser, { page = 1, artType }) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  let feed;

  const followingUsers = currentUser.following.map((user) => user._id);
  if (currentUser.role === USER_ROLES.ARTIST) {
    followingUsers.push(currentUser._id);
  }
  const skipAmount = (page - 1) * FEED_LIMIT;

  try {
    const aggregates = await Art.aggregate([
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
          commentsCount: { $size: "$comments" },
        },
      },
      {
        $group: {
          _id: null, // Grouping by null to aggregate over the entire collection
          maxLikes: { $max: "$likesCount" },
          maxComments: { $max: "$commentsCount" },
        },
      },
    ]);

    const { maxLikes = 0, maxComments = 0 } = aggregates?.[0] || {};

    const weightLikes = 0.25;
    const weightComments = 0.25;
    const weightRecency = 0.25;
    const weightArtistFollowing = 0.25;

    // Current date and time
    const currentDate = new Date();

    // Date one month ago
    const oneMonthAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );

    // Calculate maxRecencyValueForNormalization
    const maxRecencyValueForNormalization =
      currentDate.getTime() - oneMonthAgo.getTime();

    feed = await Art.aggregate([
      {
        $match: {
          // artist: { $in: followingUsers },
          isVisible: true,
          visibility: ART_VISIBILITY.PUBLIC,
          ...(artType ? { artType } : {}),
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
          isArtistFollowedByCurrentUser: {
            $in: ["$artist", followingUsers],
          },
          recencyInMillis: {
            $subtract: [new Date(), "$createdAt"],
          },
        },
      },
      {
        $addFields: {
          normalizedLikesCount: {
            $cond: [
              { $eq: [maxLikes, 0] },
              1,
              { $divide: ["$likesCount", maxLikes] },
            ],
          },
          normalizedCommentsCount: {
            $cond: [
              { $eq: [maxComments, 0] },
              0, // Or any default value if maxComments is 0
              { $divide: ["$commentsCount", maxComments] },
            ],
          },
          normalizedRecencyScore: {
            $cond: [
              { $lte: ["$recencyInMillis", 0] },
              1, // Assign a high score if the item is very new
              {
                $max: [
                  0,
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          "$recencyInMillis",
                          maxRecencyValueForNormalization,
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          normalizedArtistFollowingScore: {
            $cond: ["$isArtistFollowedByCurrentUser", 0.75, 0.25],
          },
        },
      },
      {
        $addFields: {
          score: {
            $multiply: [
              {
                $sum: [
                  { $multiply: ["$normalizedLikesCount", weightLikes] },
                  { $multiply: ["$normalizedCommentsCount", weightComments] },
                  { $multiply: ["$normalizedRecencyScore", weightRecency] },
                  {
                    $multiply: [
                      "$normalizedArtistFollowingScore",
                      weightArtistFollowing,
                    ],
                  },
                ],
              },
              100, // Scaling the score to a maximum of 100
            ],
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

export const getOnFireArt = async (currentUser, { page = 1 }) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }
  const skipAmount = (page - 1) * ON_FIRE_ART_LIMIT;

  let onFireArt;

  try {
    const aggregates = await Art.aggregate([
      {
        $group: {
          _id: null, // Grouping by null to aggregate over the entire collection
          maxLikes24h: {
            $max: {
              $size: {
                $filter: {
                  input: "$interactions",
                  as: "interaction",
                  cond: {
                    $and: [
                      { $eq: ["$$interaction.type", INTERACTION_TYPES.LIKE] },
                      {
                        $gte: [
                          "$$interaction.createdAt",
                          new Date(Date.now() - 24 * 60 * 60 * 1000),
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
          maxComments24h: {
            $max: {
              $size: {
                $filter: {
                  input: "$comments",
                  as: "comment",
                  cond: {
                    $gte: [
                      "$$comment.createdAt",
                      new Date(Date.now() - 24 * 60 * 60 * 1000),
                    ],
                  },
                },
              },
            },
          },
        },
      },
    ]);

    const { maxLikes24h = 0, maxComments24h = 0 } = aggregates?.[0] || {};

    const maxRecencyValueForNormalization = 24 * 60 * 60 * 1000;

    onFireArt = await Art.aggregate([
      {
        $match: {
          isVisible: true,
          visibility: ART_VISIBILITY.PUBLIC,
        },
      },
      {
        $addFields: {
          recentLikes: {
            $size: {
              $filter: {
                input: "$interactions",
                as: "interaction",
                cond: {
                  $and: [
                    { $eq: ["$$interaction.type", INTERACTION_TYPES.LIKE] },
                    {
                      $gte: [
                        "$$interaction.createdAt",
                        new Date(now() - 24 * 60 * 60 * 1000),
                      ],
                    },
                  ],
                },
              },
            },
          },
          recentCommentsCount: {
            $size: {
              $filter: {
                input: "$comments",
                as: "comment",
                cond: {
                  $gte: [
                    "$$comment.createdAt",
                    new Date(now() - 24 * 60 * 60 * 1000),
                  ],
                },
              },
            },
          },
          recencyInMillis: {
            $subtract: [now(), "$createdAt"],
          },
        },
      },
      {
        $addFields: {
          normalizedRecentLikes: {
            $cond: [
              { $eq: [maxLikes24h, 0] },
              0,
              { $divide: ["$recentLikes", maxLikes24h] },
            ],
          },
          normalizedRecentComments: {
            $cond: [
              { $eq: [maxComments24h, 0] },
              0,
              { $divide: ["$recentCommentsCount", maxComments24h] },
            ],
          },
          normalizedRecencyScore: {
            $cond: [
              { $lte: ["$recencyInMillis", 0] },
              1, // Assign a high score if the item is very new
              {
                $max: [
                  0,
                  {
                    $subtract: [
                      1,
                      {
                        $divide: [
                          "$recencyInMillis",
                          maxRecencyValueForNormalization,
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          score: {
            $sum: [
              "$normalizedRecentLikes",
              "$normalizedRecentComments",
              "$recencyScore",
            ],
          },
        },
      },
      // consider only score gt 0
      { $match: { score: { $gt: 0 } } },
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

  if (!onFireArt) {
    throw { status: 400, message: "Could not get onFireArt" };
  }

  return onFireArt;
};

export const createArt = async (currentUser, body) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!body) {
    throw { status: 400, message: "Please provide a valid art body!" };
  }

  let art;

  const fieldsToCreate = validateArtBody(body);

  try {
    art = await Art.create({
      ...fieldsToCreate,
      artist: currentUser._id,
    });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return getArt(currentUser, art._id);
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

export const searchArt = async (currentUser, { keyword }) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!keyword) {
    throw { status: 400, message: "Please provide a valid keyword!" };
  }

  let result;

  try {
    result = await Art.withMetrics(currentUser, {
      $match: {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
        isVisible: true,
        visibility: ART_VISIBILITY.PUBLIC,
      },
    });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  if (!result) {
    throw { status: 400, message: "Could not get art" };
  }

  return result;
};

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
              _id: new mongoose.Types.ObjectId(artId?.toString()),
              artist: currentUser._id,
            },
          },
          {
            $lookup: {
              from: "images",
              let: { imageIds: "$images" },
              pipeline: [
                {
                  $match: {
                    $expr: { $in: ["$_id", "$$imageIds"] },
                  },
                },
              ],
              as: "images",
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
          $match: {
            _id: new mongoose.Types.ObjectId(artId),
            isVisible: true,
          },
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

export const updateArt = async (currentUser, artId, body) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!body) {
    throw { status: 400, message: "Please provide a valid art body!" };
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

  if (!art?.artist?.toString() === currentUser?._id?.toString()) {
    throw { status: 400, message: "You can't update this art!" };
  }

  const fieldsToUpdate = validateArtBody(body);

  try {
    // Update without loosing other information
    await Art.updateOne({ _id: artId }, { $set: fieldsToUpdate });
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return getArt(currentUser, art._id);
};

export const deleteArt = async (currentUser, artId) => {
  if (!currentUser) {
    throw { status: 401, message: "Unauthorised request" };
  }

  if (!artId) {
    throw { status: 400, message: "Please provide a valid art id!" };
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

  if (!art?.artist?.toString() === currentUser?._id?.toString()) {
    throw { status: 400, message: "You can't delete this art!" };
  }

  try {
    await ImageService.deleteImages({
      images: await Image.find({
        _id: { $in: art.images },
      }),
      imageableType: "Art",
      imageableId: art._id,
    });

    await art.delete();
  } catch (error) {
    throw { status: 400, message: error.toString() };
  }

  return true;
};

const validateArtBody = (body) => {
  const { title, description, artType, priceInCents, visibility, isVisible } =
    body;

  let cleanTitle = xss(title);
  cleanTitle = validateString(cleanTitle, "Title");

  let cleanDescription = xss(description);
  cleanDescription = validateString(cleanDescription, "Description");

  let cleanArtType = xss(artType);
  cleanArtType = validateString(cleanArtType, "Art Type");

  let cleanPriceInCents = xss(priceInCents);
  cleanPriceInCents = Number(cleanPriceInCents);
  cleanPriceInCents = validateNumber(cleanPriceInCents, "Price");

  let cleanVisibility = xss(visibility);
  cleanVisibility = validateString(cleanVisibility, "Visibility");

  let cleanIsVisible = isVisible;
  if (!checkBoolean(cleanIsVisible)) {
    throw { status: 400, message: "Please provide a valid isVisible!" };
  }

  return {
    title: cleanTitle,
    description: cleanDescription,
    artType: cleanArtType,
    priceInCents: cleanPriceInCents,
    visibility: cleanVisibility,
    isVisible: cleanIsVisible,
  };
};
