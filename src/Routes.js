import Express from "express";

import ClientController from "./controllers/ClientController";

const router = Express.Router();

router.get("/ping", ClientController.pong);
router.post("/init", ClientController.initialize);
router.post("/touch", ClientController.createEmptyFile);
router.get("/file", ClientController.readFile);
router.post("/file", ClientController.writeFile);
router.delete("/file", ClientController.deleteFile);
router.get("/fileinfo", ClientController.getFileInfo);
router.post("/filecopy", ClientController.copyFile);
router.post("/filemove", ClientController.moveFile);
router.get("/ls", ClientController.openDirectory);
router.post("/mkdir", ClientController.makeDirectory);
router.delete("/dir", ClientController.deleteDirectory);

export default router;
