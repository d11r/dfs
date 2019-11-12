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

const createEmptyFile = (req, res, next) => {
  res.send("todo: create empty file");
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
