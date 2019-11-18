/* eslint-disable no-console */
import Storage from "../models/Storage.model";
import File from "../models/File.model";

const register = async (req, res, next) => {
  const oldStorage = await Storage.findOne({ name: req.body.name });
  if (!oldStorage) {
    const newStorage = new Storage({
      name: req.body.name,
      ip: req.body.address,
      port: req.body.port
    });
    await newStorage.save();
    res.send({
      success: true,
      message: "ok, connected to a new storage node"
    });
  } else {
    res.send({
      success: true,
      message: "ok, already initialized"
    });
  }

  next();
};

const sync = async (req, res, next) => {
  // TODO: implement functionality of uploading to multiple servers
  next();
};

export default {
  register,
  sync
};
