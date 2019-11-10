import Express from "express";

import ClientController from "./controllers/ClientController";

const router = Express.Router();

router.get("/ping", ClientController.pong);

// routes for files
router.get("/file", ClientController.readFile);
router.get("/fileinfo", ClientController.getFileInfo);

router.post("/init", ClientController.initialize);
router.post("/touch", ClientController.createEmptyFile);
router.post("/file", ClientController.writeFile);
router.post("/filecopy", ClientController.copyFile);
router.post("/filemove", ClientController.moveFile);

router.delete("/file", ClientController.deleteFile);

// routes for directories
router.get("/ls", ClientController.openDirectory);
router.get("/dir", ClientController.readDirectory);
router.post("/mkdir", ClientController.makeDirectory);
router.delete("/dir", ClientController.deleteDirectory);

export default router;
