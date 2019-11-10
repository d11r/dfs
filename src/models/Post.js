import Mongoose from "mongoose";

const Schema = Mongoose.Schema;
const { ObjectId } = Mongoose.Schema.Types;

const PostSchema = new Schema(
  {
    pictureURL: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    shortDescription: { type: String },
    author: { type: ObjectId, required: true },
    likes: { type: Number, required: true, default: 0, min: 0 },
    backgroundColor: { type: String, required: true, default: "#000" }
  },
  { timestamps: true }
);

const Model = Mongoose.model("post", PostSchema);

export default Model;
