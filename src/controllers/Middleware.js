import Directory from "../models/Directory.model";
import File from "../models/File.model";
import Storage from "../models/Storage.model";

import utils from "../config/utils";

const validateName = (req, res, next) => {
  if (!req.body.name) {
    res.status(400);
    res.send({
      success: false,
      message: "no name specified, be sure to include name in request body"
    });
  } else {
    next();
  }
};

const validatePath = (req, res, next) => {
  if (!req.body.path || !utils.isValidPath(req.body.path)) {
    res.status(400);
    res.send({
      success: false,
      message:
        "given path is invalid or not specified, must start and end with '/'"
    });
  } else {
    next();
  }
};

const validateDirectory = async (req, res, next) => {
  const directory = await Directory.findOne({ path: req.body.path });
  if (!directory) {
    res.status(400);
    res.send({
      success: false,
      message: "directory with specified path does not exist"
    });
  } else {
    next();
  }
};

export default {
  validateName,
  validatePath,
  validateDirectory
};
