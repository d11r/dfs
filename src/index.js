/* eslint-disable no-console */
/* eslint-disable new-cap */
import Express from "express";
import bodyParser from "body-parser";

import { setup, connect } from "./Connections";
import routes from "./Routes";

// Setup Mongoose
setup();
connect();
// Setup dotenv env. variables
require("dotenv").config();

const app = Express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", routes);

app.listen(process.env.APP_PORT, () => {
  console.info("Server running");
});
