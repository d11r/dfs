import _ from "lodash";

import Directory from "../models/Directory.model";
import File from "../models/File.model";
import Storage from "../models/Storage.model";

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
    hash: _.repeat("0", 64), // 00000... (64 times)
    directory: directory ? directory.id : newDirectory.id, // if such directory doesnt exist, create new
    storages: [] // don't store empty files on storage servers
  });

  const savedFile = await newFile.save();

  if (savedFile) {
    // save file also to directory's list of files
    if (directory) {
      directory.files.push(savedFile.id);
    } else {
      directory.files.push(savedFile.id);
    }
    await directory.save();

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

// TODO: @peter, communicate with vlad how to do it
const readFile = (req, res, next) => {
  res.send("todo: read file");
  next();
};

// TODO: @peter, communicate with vlad how to do it
const writeFile = (req, res, next) => {
  res.send("todo: write file");
  next();
};

const deleteFile = async (req, res, next) => {
  const directory = await Directory.findOne({ path: req.body.path });

  if (!directory) {
    res.status(400);
    res.send({
      success: false,
      message: "directory with specified path does not exist"
    });
    return;
  }

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
    return;
  }

  await file.remove();
  res.send({ success: true });
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
