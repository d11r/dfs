import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const DirectorySchema = new Schema({
  path: { type: String, required: true, trim: true, index: true },
  files: [Mongoose.Types.ObjectId]
});

export default Mongoose.model("Directory", DirectorySchema);
