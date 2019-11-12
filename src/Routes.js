import Express from "express";

import ClientController from "./controllers/ClientController";
import StorageController from "./controllers/StorageController";
import Middleware from "./controllers/Middleware";

const router = Express.Router();

// ping/pong response from server
router.get("/ping", ClientController.pong);

// initialize
router.post("/init", ClientController.initialize);

// routes for files
router.get("/file", ClientController.readFile);
router.get("/fileinfo", ClientController.getFileInfo);

router.post(
  "/touch",
  [Middleware.validateName, Middleware.validatePath],
  ClientController.createEmptyFile
);
router.post("/file", ClientController.writeFile);
router.post("/filecopy", ClientController.copyFile);
router.post("/filemove", ClientController.moveFile);

router.delete(
  "/file",
  [
    Middleware.validateName,
    Middleware.validatePath,
    Middleware.validateDirectory
  ],
  ClientController.deleteFile
);

// routes for directories
router.get("/ls", ClientController.openDirectory);
router.get("/dir", ClientController.readDirectory);
router.post("/mkdir", ClientController.makeDirectory);
router.delete("/dir", ClientController.deleteDirectory);

// routes for storage servers
router.post("/register", StorageController.register);

export default router;
