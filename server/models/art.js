import { Schema, model } from "mongoose";
import {
  ART_TYPES,
  ART_VISIBILITY,
  INTERACTION_TYPES,
  TOP_COMMENTS_COUNT,
} from "../constants.js";

const InteractionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(INTERACTION_TYPES), // Enum to restrict the type to either 'like' or 'viewed'
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ArtSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    artType: {
      type: String,
      enum: Object.values(ART_TYPES),
      required: [true, "Art type is required!"],
    },
    priceInCents: {
      type: Number,
      required: [true, "Price is required!"],
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    visibility: {
      type: String,
      enum: Object.values(ART_VISIBILITY),
      default: ART_VISIBILITY.PUBLIC,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    interactions: [InteractionSchema],
    comments: [CommentsSchema],
  },
  {
    timestamps: true,
    statics: {
      async withMetrics(currentUser, matchObj) {
        return await this.aggregate([
          matchObj,
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
              viewsCount: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.type", "view"] },
                  },
                },
              },
              commentsCount: { $size: "$comments" },
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
      },
    },
  }
);

ArtSchema.index({
  title: "text",
  description: "text",
});

const Art = model("Art", ArtSchema);

export default Art;
