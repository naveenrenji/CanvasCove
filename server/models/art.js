import { Schema, model } from "mongoose";
import { ART_TYPES, ART_VISIBILITY, INTERACTION_TYPES } from "../constants.js";

const InteractionSchema = new Schema({
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
  interactionDate: {
    type: Date,
    default: Date.now,
  },
});

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
    price: {
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
    comments: [
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
        commentDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    statics: {
      async withMetrics(currentUser, matchObj) {
        return await this.aggregate([
          matchObj,
          {
            $addFields: {
              totalLikes: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.type", "like"] },
                  },
                },
              },
              totalViews: {
                $size: {
                  $filter: {
                    input: "$interactions",
                    as: "interaction",
                    cond: { $eq: ["$$interaction.type", "view"] },
                  },
                },
              },
              totalComments: { $size: "$comments" },
              currentUserInteractions: {
                $filter: {
                  input: "$interactions",
                  as: "interaction",
                  cond: { $eq: ["$$interaction.user", currentUser._id] },
                },
              },
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
