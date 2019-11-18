/* eslint-disable prefer-template */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable eqeqeq */
import _ from "lodash";
import Mongoose from "mongoose";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

import Directory from "../models/Directory.model";
import File from "../models/File.model";
import Storage from "../models/Storage.model";

import getHash from "../config/getFileHash";

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
    directory: directory ? directory.id : newDirectory.id, // if such directory doesnt exist, create new
    storages: [] // don't store empty files on storage servers
  });

  const savedFile = await newFile.save();

  if (savedFile) {
    // save file also to directory's list of files
    if (directory) {
      directory.files.push(savedFile.id);
      await directory.save();
    } else {
      newDirectory.files.push(savedFile.id);
      await newDirectory.save();
    }

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

const readFile = async (req, res) => {
  const file = await File.findOne({
    name: req.body.name
  })
    .populate({
      path: "directories",
      match: { path: req.body.path }
    })
    .populate({
      path: "storages"
    });

  // probe all storage servers related to file
  for (let i = 0; i < file.storages.length; i += 1) {
    const storage = file.storages[i];
    const ip = storage.ip;
    const port = storage.port;

    try {
      const response = await axios({
        method: "get",
        url: `http://${ip}:${port}/api/ping`,
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response) {
        console.log("redirected to", `http://${ip}:${port}/api/download`);
        res.redirect(307, `http://${ip}:${port}/api/download`);
        return;
      } else if (i < file.storages.length - 1) {
        console.log(
          "could not get file from storage server, retrying on another..."
        );
      } else if (i === file.storages.length - 1) {
        res.status(500);
        res.send({
          success: false,
          message: "failed to download specified file"
        });
      }
    } catch (e) {
      console.log("error...");
      res.status(500);
      res.send({
        success: false,
        message: "failed to download specified file\nerror:" + e
      });
    }
  }
};

const writeFile = async (req, res, next) => {
  // first, save the file to local db
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
    name: req.file.filename,
    directory: directory ? directory.id : newDirectory.id, // if such directory doesnt exist, create new
    storages: [],
    hash: await getHash(
      path.join(__dirname, "../../uploads", req.file.filename)
    )
  });

  const savedFile = await newFile.save();

  if (savedFile) {
    // save file also to directory's list of files
    if (directory) {
      directory.files.push(savedFile.id);
      await directory.save();
    } else {
      newDirectory.files.push(savedFile.id);
      await newDirectory.save();
    }

    // then, distribute file to storage servers
    const storages = await Storage.find({});

    let successfulStores = 0;
    for (let i = 0; i < storages.length; i += 1) {
      const storage = storages[i];
      const ip = storage.ip;
      const port = storage.port;

      const fd = new FormData();
      fd.append(
        "u_file",
        fs.createReadStream(
          path.join(__dirname, "../../uploads", req.file.filename)
        )
      );

      try {
        const response = await axios({
          method: "post",
          url: `http://${ip}:${port}/api/upload`,
          data: fd,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${fd.getBoundary()}`
          }
        });

        const file = await File.findOne({
          hash: response.data.info.file.hash
        });

        if (file) {
          file.storages.push(storage.id);
          await file.save();
          successfulStores += 1;
          if (successfulStores === 2) {
            console.log(
              "successfully uploaded file to two storages, exiting..."
            );
            break;
          }
        } else {
          console.log("ERROR!");
          console.log(
            "couldnt find file with hash",
            response.data.info.file.hash
          );
        }
      } catch (e) {
        console.log(
          "one of storages could not store the file, trying with another..."
        );
      }
    }

    res.send({
      success: true,
      message: "uploaded"
    });
  } else {
    res.status(500);
    res.send({
      success: false,
      message: "unknown error happened"
    });
  }
  next();
};

const deleteFile = async (req, res, next) => {
  const file = await File.findOne({
    name: req.body.name
  }).populate({
    path: "directories",
    match: { path: req.body.path }
  });

  const directory = await Directory.findOne({ path: req.body.path });
  directory.files = directory.files.filter(f => f != file.id);
  await directory.save();

  await file.remove();
  res.send({ success: true });
  next();
};

const getFileInfo = async (req, res, next) => {
  const file = await File.findOne({
    name: req.body.name
  }).populate({
    path: "directories",
    match: { path: req.body.path }
  });

  res.send({
    success: true,
    metadata: {
      name: file.name,
      path: req.body.path,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      ...file.metadata
    }
  });

  next();
};

const copyFile = async (req, res, next) => {
  const file = await File.findOne({
    name: req.body.name
  });

  const directory = await Directory.findOne({ path: req.body.path });

  const newFile = new File({
    ...file,
    name: `${file.name}-${_.random(0, 100000)}`,
    isNew: true,
    _id: Mongoose.Types.ObjectId()
  });

  const savedFile = await newFile.save();

  directory.files.push(savedFile.id);
  await directory.save();

  res.send({
    success: true,
    path: req.body.path,
    newFile: savedFile
  });

  next();
};

const moveFile = async (req, res, next) => {
  const file = await File.findOne({
    name: req.body.name
  });

  // remove from last folder
  const oldDir = await Directory.findOne({ path: req.body.path });
  oldDir.files = oldDir.files.filter(f => f != file.id);
  await oldDir.save();

  const directory = await Directory.findOne({ path: req.body.newPath });
  let newDirectory;
  let newFile;

  // add to new folder
  // if there is such a folder, put in there
  // if not, make new folder
  if (!directory) {
    newDirectory = new Directory({
      path: req.body.newPath,
      files: []
    });
    const newDir = await newDirectory.save();
    file.directory = newDir.id;
    const newF = await file.save();
    newDir.files.push(newF.id);
    newFile = newF;
    await newDir.save();
  } else {
    file.directory = directory.id;
    const newF = await file.save();
    newFile = newF;
    directory.files.push(newF.id);
    await directory.save();
  }

  res.send({
    success: true,
    path: req.body.path,
    newPath: req.body.newPath,
    newFile
  });

  next();
};

const openDirectory = (req, res, next) => {
  res.send("todo: open directory (cd)");
  next();
};

const readDirectory = async (req, res, next) => {
  const directory = await Directory.findOne({ path: req.body.path }).populate(
    "files"
  );

  res.send({
    success: true,
    files: directory.files,
    id: directory.id,
    path: directory.path
  });

  next();
};

const makeDirectory = async (req, res, next) => {
  const directory = new Directory({
    path: req.body.path,
    files: []
  });
  await directory.save();

  res.send({
    success: true,
    path: req.body.path
  });

  next();
};

const deleteDirectory = async (req, res, next) => {
  const directory = await Directory.findOne({ path: req.body.path });
  // delete all the contents of the directory
  directory.files.forEach(async f => {
    const file = await File.findById(f);
    await file.remove();
  });

  // also delete the directory itself
  await directory.remove();

  res.send({ success: true });

  next();
};

export default {
  pong,
  initialize,
  createEmptyFile,
  readFile,
  deleteFile,
  getFileInfo,
  copyFile,
  moveFile,
  openDirectory,
  readDirectory,
  makeDirectory,
  deleteDirectory,
  writeFile
};
