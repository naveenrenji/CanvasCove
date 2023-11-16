import { Schema, model } from "mongoose";

const ArtSchema = new Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Art = model("Art", ArtSchema);

export default Art;
