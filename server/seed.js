import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { ART_TYPES, GENDERS, USER_ROLES } from "./constants.js";
import { Art, User } from "./models/index.js";
import { userData } from "./data/index.js";
import PasswordService from "./services/password-service.js";

await mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Database connected successfully`))
  .catch((err) => console.log(err));

let testUser, artistUser;
// Create a user with connosier role
try {
  testUser = await User.create({
    email: "test@canvascove.com",
    firstName: "Test",
    lastName: "User",
    displayName: "Tester",
    encryptedPassword: await new PasswordService("Password@123").encrypt(),
    phone: "1234567890",
    dateOfBirth: new Date("1990-01-01"),
    gender: GENDERS.OTHER,
  });
  console.log("Created test user!");
} catch (error) {
  console.log(error);
}

// Create a user with artist role
try {
  artistUser = await User.create({
    email: "anonymous@canvascove.com",
    firstName: "Anonymous",
    lastName: "User",
    displayName: "Anonymouse",
    encryptedPassword: await new PasswordService("Password@123").encrypt(),
    phone: "0987654321",
    dateOfBirth: new Date("1995-01-01"),
    gender: GENDERS.FEMALE,
    role: USER_ROLES.ARTIST,
  });
  console.log("Created artist user!");
} catch (error) {
  console.log(error);
}

if (testUser && artistUser) {
  console.log("Users created successfully!");
  try {
    await Art.create({
      title: "Test Art",
      description: "This is a test art",
      artist: artistUser._id,
      artType: ART_TYPES.PAINTING,
      priceInCents: 1999,
    });
    console.log("Created test art!");
  } catch (error) {
    console.log(error);
  }

  try {
    await userData.updateFollowingStatus(testUser, artistUser._id)
    console.log("Users followed each other successfully!");
  } catch (error) {
    console.log(error);
  }
} else {
  console.log("Required users not created!");
}

console.log("Seeding completed!");
