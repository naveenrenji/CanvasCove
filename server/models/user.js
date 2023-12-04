import mongoose, { Schema, model } from "mongoose";

import JwtService from "../services/jwt-service.js";
import PasswordService from "../services/password-service.js";

import { isValidEmail, validateDOB } from "../validators/helpers.js";
import { GENDERS, USER_ROLES } from "../constants.js";

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required!"],
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
      required: [true, "Display name is required!"],
      unique: [true, "Display name already exists!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email already exists!"],
      trim: true,
      validate: {
        validator: function (v) {
          return isValidEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required!"],
      validate: {
        validator: function (v) {
          try {
            validateDOB(v);
            return true;
          } catch {
            return false;
          }
        },
        message: (props) => `${props.value} is not a valid date of birth!`,
      },
    },
    gender: {
      type: String,
      validate: {
        validator: function (v) {
          return Object.values(GENDERS).includes(v);
        },
        message: (props) => `${props.value} is not a valid gender!`,
      },
      required: [true, "Gender is required!"],
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
    },
    bio: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CONNOISSEUR,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    timestamps: true,
    methods: {
      async verifyPassword(password) {
        try {
          return new PasswordService(password).verify(this.encryptedPassword);
        } catch (error) {
          return false;
        }
      },
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
      generateToken() {
        return JwtService.encrypt({
          _id: this._id,
          email: this.email,
        });
      },
    },
    statics: {
      async viewCurrentUser(currentUser) {
        const result = await this.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(currentUser._id.toString()),
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
            $addFields: {
              followersCount: {
                $size: "$followers",
              },
              followingCount: {
                $size: "$following",
              },
            },
          },
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              displayName: 1,
              email: 1,
              bio: 1,
              dob: 1,
              images: 1,
              gender: 1,
              role: 1,
              followersCount: 1,
              followingCount: 1,
            },
          },
        ]);
        return result?.length ? result[0] : null;
      },
      async view(currentUser, userId) {
        const result = await this.fetch(currentUser, [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(userId.toString()),
            },
          },
        ]);

        return result?.length ? result[0] : null;
      },
      async fetch(currentUser, matchQuery, { page, limit, sortQuery } = {}) {
        return this.aggregate([
          ...matchQuery,
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
            $addFields: {
              followersCount: {
                $size: "$followers",
              },
              followingCount: {
                $size: "$following",
              },
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
          // sort by updated at
          sortQuery || {
            $sort: {
              updatedAt: -1,
            },
          },
          ...(page && limit
            ? [{ $skip: (page - 1) * limit }, { $limit: limit }]
            : []),
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              displayName: 1,
              images: 1,
              bio: 1,
              followersCount: 1,
              followingCount: 1,
              isFollowedByCurrentUser: 1,
              isFollowingCurrentUser: 1,
            },
          },
        ]);
      },
    },
  }
);

UserSchema.index({
  firstName: "text",
  lastName: "text",
  displayName: "text",
  email: "text",
});

const User = model("User", UserSchema);

export default User;
