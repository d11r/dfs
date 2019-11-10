/* eslint-disable no-console */
/* eslint-disable new-cap */
import Express from "express";

import { setup, connect } from "./Connections";

// Setup Mongoose
setup();
connect();
// Setup dotenv env. variables
require("dotenv").config();

const app = Express();

app.listen(process.env.APP_PORT, () => {
  console.info("Server running");
});
