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

let buffer = [];

const sync = async (req, res, next) => {
  console.log("received sync");
  const f = await File.findOne({
    hash: req.body.file.hash
  });
  const ss = await Storage.findOne({
    ip: req.body.server.address,
    port: req.body.server.port,
    name: req.body.server.name
  });

  console.log("ss is", ss);

  if (f) {
    // check if there are two storage nodes containing the file
    if (f.storages.length === 0) {
      f.storages.push(ss.id);
      // f.storages = f.storages.filter((i, idx) => f.storages.indexOf(i) === idx);
      await f.save();
    }
    if (f.storages.length + 1 > 2) {
      res.send({
        success: true,
        shouldReplicate: false
      });
      return;
    }
    // must be 1 only storage server containing the file
    console.log("here...");
    const newSS = await Storage.findOne({
      _id: { $ne: ss.id }
    });

    if (newSS) {
      // great! we have a storage server to replicate to
      // redirect to new ss
      // the way to do it is by having another request from oldSS that sends formData with the file (upload Request)
      // and naming server just redirects
      console.log("got new ss");
      if (buffer.length === 100) buffer = [];
      buffer.push(newSS.id);
      console.log("buffer", buffer);

      res.send({
        success: true,
        shouldReplicate: true,
        message:
          "please send another POST request to /replicate with form data of the file"
      });
    } else {
      console.log("no more replication servers available :(");
    }
  } else {
    res.send({
      success: false,
      message: "there is no file with hash specified"
    });
  }

  next();
};

const replicate = async (req, res, next) => {
  console.log("in replicate");
  if (buffer.length < 1) {
    console.log("replicate: buffer smaller than 1");
    res.status(400);
    res.send({
      success: false,
      message: "no replication server available"
    });
    return;
  }
  console.log("buffer ok", buffer);
  const newSS = await Storage.findById(buffer[buffer.length - 1]);
  console.log("new storage server for repl", newSS);

  res.redirect(307, `http://${newSS.ip}:${newSS.port}/api/upload`);
  next();
};

export default {
  register,
  sync,
  replicate
};
