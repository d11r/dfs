import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const StorageSchema = new Schema(
  {
    name: { type: String, required: true, max: 100, trim: true },
    ip: { type: String, required: true, trim: true },
    port: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default Mongoose.model("Storage", StorageSchema);
