import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const FileSchema = new Schema({
  name: { type: String, required: true, max: 100, trim: true },
  hash: { type: String, required: true, maxlength: 64, minlength: 64 },
  path: { type: String, required: true, trim: true },
  storages: [Schema.Types.ObjectId],
  metadata: { type: String, required: true }
});

export default Mongoose.model("File", FileSchema);
