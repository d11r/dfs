/* eslint-disable consistent-return */
import fs from "fs";
import crypto from "crypto";

function fileHash(filename, algorithm = "sha256") {
  return new Promise((resolve, reject) => {
    const shasum = crypto.createHash(algorithm);
    try {
      let s = fs.ReadStream(filename);
      s.on("data", data => {
        shasum.update(data);
      });
      s.on("end", () => {
        const hash = shasum.digest("hex");
        return resolve(hash);
      });
    } catch (error) {
      return reject("calc fail");
    }
  });
}

export default fileHash;
