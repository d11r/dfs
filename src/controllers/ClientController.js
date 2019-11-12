import _ from "lodash";

import Directory from "../models/Directory.model";
import File from "../models/File.model";
import Storage from "../models/Storage.model";

import { isValidPath } from "../config/utils";

const pong = (req, res, next) => {
  res.send("pong");
  next();
};

const initialize = async (req, res, next) => {
  await Directory.deleteMany({});
  await File.deleteMany({});

  const root = new Directory({
    path: "/",
    files: []
  });

  await root.save();
  res.send({
    success: true,
    root: "/"
  });
  next();
};

const createEmptyFile = async (req, res, next) => {
  if (!req.body.name) {
    res.status(400);
    res.send({
      success: false,
      message: "no name specified, be sure to include name in request body"
    });
  }

  if (!isValidPath(req.body.path)) {
    res.status(400);
    res.send({
      success: false,
      message: "given path is invalid, must start and end with '/'"
    });
  }

  const directory = await Directory.findOne({ path: req.body.path });
  let newDirectory;

  if (!directory) {
    newDirectory = new Directory({
      path: req.body.path,
      files: []
    });
    await newDirectory.save();
  }

  const newFile = new File({
    name: req.body.name,
    hash: _.repeat("0", 64),
    directory: directory ? directory.id : newDirectory.id,
    storages: []
  });

  const savedFile = await newFile.save();
  if (savedFile) {
    res.send({
      success: true,
      path: req.body.path,
      newFile: savedFile
    });
  } else {
    res.send({
      success: false,
      message: "unknown error happened"
    });
  }

  next();
};

const readFile = (req, res, next) => {
  res.send("todo: read file");
  next();
};

const writeFile = (req, res, next) => {
  res.send("todo: write file");
  next();
};

const deleteFile = (req, res, next) => {
  res.send("todo: delete file");
  next();
};

const getFileInfo = (req, res, next) => {
  res.send("todo: get file info");
  next();
};

const copyFile = (req, res, next) => {
  res.send("todo: copy file");
  next();
};

const moveFile = (req, res, next) => {
  res.send("todo: move file");
  next();
};

const openDirectory = (req, res, next) => {
  res.send("todo: open directory (cd)");
  next();
};

const readDirectory = (req, res, next) => {
  res.send("todo: return list of files stored in directory");
  next();
};

const makeDirectory = (req, res, next) => {
  res.send("todo: mkdir");
  next();
};

const deleteDirectory = (req, res, next) => {
  res.send("todo: delete dir");
  next();
};

export default {
  pong,
  initialize,
  createEmptyFile,
  readFile,
  writeFile,
  deleteFile,
  getFileInfo,
  copyFile,
  moveFile,
  openDirectory,
  readDirectory,
  makeDirectory,
  deleteDirectory
};
