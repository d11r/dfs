/* eslint-disable no-console */
import Mongoose from "mongoose";

const setup = () => {
  Mongoose.Promise = Promise;

  Mongoose.connection.on("connected", () => {
    console.log("MongoDB: Connection Established");
  });

  Mongoose.connection.on("reconnected", () => {
    console.log("MongoDB: Connection Reestablished");
  });

  Mongoose.connection.on("disconnected", () => {
    console.log("MongoDB: Connection Disconnected");
  });

  Mongoose.connection.on("close", () => {
    console.log("MongoDB: Connection Closed");
  });

  Mongoose.connection.on("error", error => {
    console.log(error);
  });
};

const connect = async () => {
  Mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  );
};

export { setup, connect };
