import Express from "express";

import ClientController from "./controllers/ClientController";

const router = Express.Router();

router.get("/ping", ClientController.pong);

export default router;
