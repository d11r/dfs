/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import Mongoose from "mongoose";
import jwt from "jsonwebtoken";

import generateJWT from "../auth/JWT";

const Schema = Mongoose.Schema;
const { ObjectId } = Mongoose.Schema.Types;

Mongoose.promise = global.Promise;

const AuthorSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: {
      type: String,
      lowercase: true,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    followers: { type: [ObjectId], default: [] },
    posts: { type: [ObjectId], default: [] },
    profilePhoto: {
      type: String,
      default: "https://robohash.org/a.png?size=300x300"
    },
    gender: {
      type: String,
      default: ""
    },
    social: {
      facebookProvider: {
        id: String,
        token: String
      },
      googleProvider: {
        id: String,
        token: String
      }
    },
    token: {
      type: String
    }
  },
  { timestamps: true }
);

AuthorSchema.statics.upsertFbUser = async function({
  accessToken,
  refreshToken,
  profile
}) {
  const User = this;

  const user = await User.findOne({
    "social.facebookProvider.id": profile.id
  });

  // todo: refresh token
  if (user) {
    return user;
  }

  const newUser = await User.create({
    firstName: profile.name.givenName || "",
    lastName: profile.name.familyName || "",
    username: profile.id,
    email: profile.emails[0].value,
    profilePhoto: profile.photos[0].value,
    gender: profile.gender || "",
    token: generateJWT(profile.email, profile.id),
    "social.facebookProvider": {
      id: profile.id,
      token: accessToken
    }
  });

  return newUser;
};

AuthorSchema.statics.upsertGoogleUser = async function({
  accessToken,
  refreshToken,
  profile
}) {
  const User = this;

  const user = await User.findOne({ "social.googleProvider.id": profile.id });

  // no user was found, lets create a new one
  if (!user) {
    const newUser = await User.create({
      firstName: profile.name.givenName || "",
      lastName: profile.name.familyName || "",
      username: profile.id,
      email: profile.emails[0].value,
      profilePhoto: profile._json.picture,
      token: generateJWT(profile.email, profile.id),
      "social.googleProvider": {
        id: profile.id,
        token: accessToken
      }
    });

    return newUser;
  }
  return user;
};

const Model = Mongoose.model("author", AuthorSchema);

export default Model;
