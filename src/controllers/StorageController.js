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
  const f = await File.findOne({
    hash: req.body.file.hash
  });
  const ss = await Storage.findOne({
    ip: req.body.server.address,
    port: req.body.server.port,
    name: req.body.server.name
  });

  if (f) {
    // check if there are two storage nodes containing the file
    if (f.storages.length === 0) {
      f.storages.push(ss.id);
      const newFile = await f.save();
      res.send({
        success: true,
        file: { ...newFile }
      });
    } else {
      // must be 1 only storage server containing the file
      const newSS = await Storage.findOne({
        _id: { $ne: ss.id }
      });

      if (newSS) {
        // great! we have a storage server to replicate to
        // redirect to new ss
        // TODO: redirect to another storage server
        // the way to do it is by having another request from oldSS that sends formData with the file (upload Request)
        // and naming server just redirects
        res.send({
          success: true,
          message:
            "please send another POST request to /replicate with form data"
        });
      } else {
        console.log("no more replication servers available :(");
      }
    }
  } else {
    res.send({
      success: false,
      message: "there is no file with hash specified"
    });
  }

  next();
};

export default {
  register,
  sync
};
