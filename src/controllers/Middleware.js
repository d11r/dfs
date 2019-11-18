import Directory from "../models/Directory.model";
import File from "../models/File.model";

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

const validateNewPath = (req, res, next) => {
  if (!req.body.newPath || !utils.isValidPath(req.body.newPath)) {
    res.status(400);
    res.send({
      success: false,
      message:
        "given newPath is invalid or not specified, must start and end with '/'"
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

const validateDirectoryDoesntExist = async (req, res, next) => {
  const directory = await Directory.findOne({ path: req.body.path });
  if (directory) {
    res.status(400);
    res.send({
      success: false,
      message: "directory with specified path already exists"
    });
  } else {
    next();
  }
};

const validateFile = async (req, res, next) => {
  const file = await File.findOne({
    name: req.body.name
  }).populate({
    path: "directories",
    match: { path: req.body.path }
  });

  if (!file) {
    res.status(400);
    res.send({
      success: false,
      message: "file with specified name on the specified path does not exist"
    });
  } else {
    next();
  }
};

const requireForce = async (req, res, next) => {
  if (req.body.force) {
    next();
  } else {
    res.status(403);
    res.send({
      success: false,
      message:
        "in order to perform this action you need to specify 'force' field, set it to true"
    });
  }
};

const validateHash = async (req, res, next) => {
  if (req.body.hash) {
    next();
  } else {
    res.status(400);
    res.send({
      success: false,
      message:
        "in order to perform this action you need to specify 'hash' field"
    });
  }
};

const validateStorage = (req, res, next) => {
  if (!req.body.address) {
    res.status(400);
    res.send({
      success: false,
      message: "no ip address specified"
    });
  } else if (!req.body.port) {
    res.status(400);
    res.send({
      success: false,
      message: "no port specified"
    });
  } else if (!req.body.name) {
    res.status(400);
    res.send({
      success: false,
      message: "no name specified"
    });
  } else {
    next();
  }
};

const validateMulter = (req, res, next) => {
  if (req.file && req.file.filename) next();
  else {
    res.status(400);
    res.send({
      success: false,
      message: "file not specified in form data"
    });
  }
};

export default {
  validateName,
  validatePath,
  validateDirectory,
  validateFile,
  validateNewPath,
  validateDirectoryDoesntExist,
  requireForce,
  validateStorage,
  validateHash,
  validateMulter
};
