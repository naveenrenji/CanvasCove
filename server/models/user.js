import { Schema, model } from "mongoose";

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
    phone: {
      type: String,
      required: [true, "Phone number is required!"],
      unique: [true, "Phone number already exists!"],
      trim: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    dateOfBirth: {
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
