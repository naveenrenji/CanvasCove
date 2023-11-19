import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

import { GENDERS, USER_ROLES } from "./constants.js";
import { User } from "./models/index.js";
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
    phone: "09087654321",
    dateOfBirth: new Date("1995-01-01"),
    gender: GENDERS.FEMALE,
    role: USER_ROLES.ARTIST,
  });
} catch (error) {
  console.log(error);
}

if (testUser && artistUser) {
  console.log("Users created successfully!");
  try {
    await testUser.followedBy.push(artistUser._id);
    await artistUser.followers.push(testUser._id);
    await testUser.save();
    await artistUser.save();
    console.log("Users followed each other successfully!");
  } catch (error) {
    console.log(error);
  }
} else {
  console.log("Users not created!");
}

console.log("Seeding completed!");
