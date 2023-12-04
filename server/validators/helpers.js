import { isValidObjectId } from "mongoose";
import { DateTime } from "luxon";
import { City, State } from "country-state-city";
import { GENDERS, USER_ROLES, INTERACTION_TYPES } from "../constants.js";

const COUNTRY_CODE = "US";

const validateStateAndCity = (state, city) => {
  state = validateString(state, "State");
  city = validateString(city, "City");

  const stateObj = State.getStateByCodeAndCountry(state, COUNTRY_CODE);
  if (!stateObj) {
    throw { status: 400, message: "Invalid State" };
  }
  const cityObj = City.getCitiesOfState(COUNTRY_CODE, state)?.find(
    (c) => c.name === city && c.stateCode === state
  );
  if (!cityObj) {
    throw { status: 400, message: "Invalid City" };
  }
  return {
    state: cityObj.stateCode,
    city: cityObj.name,
  };
};


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) return false;
  return true;
}

function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    return false;
  }
  return true;
}

const validateEmail = (email, variableName = "Email") => {
  if (typeof email !== "string") {
    throw {
      status: 400,
      message: `${variableName} must be a string!`,
    };
  }
  if (!email) {
    throw {
      status: 400,
      message: `${variableName} is required!`,
    };
  }
  email = email?.trim()?.toLowerCase();
  if (!email?.length) {
    throw {
      status: 400,
      message: `${variableName} must not be empty!`,
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw { status: 400, message: `Invalid ${variableName}` };
  }
  return email;
};

const validatePassword = (password, variableName = "Password") => {
  if (!password) {
    throw {
      status: 400,
      message: `${variableName} is required!`,
    };
  }
  if (
    !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    throw {
      status: 400,
      message: `${variableName} must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.`,
    };
  }
  return password;
};

const checkBoolean = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  return false;
};

const validateString = (value, name = 'String', { minLength = 1, maxLength } = {}) => {
  if (!value) {
    throw { status: 400, message: `${name} is required!` };
  }

  if (typeof value !== "string") {
    throw { status: 400, message: `${name} is not a string!` };
  }

  value = value.trim();

  if (!value) {
    throw { status: 400, message: `${name} is required!` };
  }

  if (value.length < minLength) {
    throw {
      status: 400,
      message: `${name} must be at least ${minLength} characters long!`,
    };
  }
  if (maxLength && value.length > maxLength) {
    throw {
      status: 400,
      message: `${name} must be no more than ${maxLength} characters long!`,
    };
  }
  if (["firstName", "lastName"].includes(name) && value.match(/[0-9]/g)) {
    throw {
      status: 400,
      message: `${name} must not contain numbers`,
    };
  }
  return value;
};

const validateNumber = (value, name) => {
  if (typeof value !== "number") {
    throw { status: 400, message: `${name} is not a number!` };
  }
  if (isNaN(value)) {
    throw { status: 400, message: `${name} is not a number!` };
  }

  return value;
};

const validateNumberRange = (value, name, opts = {}) => {
  const { min, max, includeMin, includeMax } = opts || { min: 1 };

  validateNumber(value, name);
  if (value < min && (!includeMin || value !== min)) {
    throw {
      status: 400,
      message: [
        name,
        "must be greater than",
        includeMin ? "or equal to" : "",
        min,
      ].join(" "),
    };
  }
  if (max && value > max && (!includeMax || value !== max)) {
    throw {
      status: 400,
      message: [
        name,
        "must be less than",
        includeMax ? "or equal to" : "",
        max,
      ].join(" "),
    };
  }
};

const validateId = (value, name) => {
  value = validateString(value, name);

  if (!isValidObjectId(value)) {
    throw { status: 400, message: `${name} is not a valid id!` };
  }

  return value;
};

const validateDOB = (dob, name) => {
  if (!dob) {
    throw { status: 400, message: "Date of birth is required." };
  }

  if (dob > DateTime.now()) {
    throw {
      status: 400,
      message: "Date of birth cannot be in the future.",
    };
  }
  // dob must be at least 18 years ago using luxon
  const eighteenYearsAgo = DateTime.now().minus({ years: 15 });
  if (dob > eighteenYearsAgo) {
    throw {
      status: 400,
      message: "You must be at least 18 years old to register.",
    };
  }

  // dob must be at max 100 years ago
  const oneHundredYearsAgo = DateTime.now().minus({ years: 75 });
  if (dob < oneHundredYearsAgo) {
    throw {
      status: 400,
      message: "You must be less than 100 years old to register.",
    };
  }
  return dob;
};

const validatePhone = (value, name) => {
  if (!value) {
    throw {
      status: 400,
      message: `${name} is required!`,
    };
  }
  value = value.trim();
  if (isNaN(value))
    throw { status: 400, message: `${name} must only contain numbers` };
  if (!/^[1-9]\d{9}$/.test(value)) {
    throw {
      status: 400,
      message: `${name} must contain only 10 digits and not begin with 0`,
    };
  }
  return value;
};

const validateName = (name, varName = "Name") => {
  name = validateString(name, varName);

  if (!/^[a-zA-Z\s]{3,20}$/.test(name)) {
    throw {
      status: 400,
      message: `${varName} must be between 3 and 20 characters long and contain only letters.`,
    };
  }

  return name;
};

const validateGender = (value, name = "Selection") => {
  if (!value) {
    throw {
      status: 400,
      message: `${name} is required!`,
    };
  }
  if (!Object.values(GENDERS).includes(value)) {
    throw {
      status: 400,
      message: `Invalid ${name}`,
    };
  }
  return value;
};

const validateRole = (value, name = "Entity") => {
  if (!value) {
    throw {
      status: 400,
      message: `${name} is required!`,
    };
  }
  if (!Object.values(USER_ROLES).includes(value)) {
    throw {
      status: 400,
      message: `Invalid ${name}`,
    };
  }
  return value;
};

const validateInteractionType = (value) => {
  value = validateString(value, "Interaction Type");

  if (!Object.values(INTERACTION_TYPES).includes(value)) {
    throw {
      status: 400,
      message: `Invalid Interaction Type`,
    };
  }
  return value;
};

const validateSignUp = (payload) => {
  let { displayName, firstName, lastName, email, password, dob, role, gender } =
    payload;

  displayName = validateName(displayName, "Display Name");
  firstName = validateName(firstName, "First Name");
  lastName = validateName(lastName, "Last Name");
  email = validateEmail(email);
  password = validatePassword(password);
  dob = validateDOB(dob);
  role = validateRole(role);
  gender = validateGender(gender);

  return { displayName, firstName, lastName, email, password, dob, role, gender };
};


export {
  isValidEmail,
  isValidPassword,
  checkBoolean,
  validateNumber,
  validateNumberRange,
  validateString,
  validateId,
  validateDOB,
  validatePhone,
  validatePassword,
  validateEmail,
  validateName,
  validateGender,
  validateStateAndCity,
  validateInteractionType,
  validateSignUp,
  validateRole,
};
