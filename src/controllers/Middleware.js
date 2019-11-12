import utils from "../config/utils";

const validateName = (req, res, next) => {
  if (!req.body.name) {
    res.status(400);
    res.send({
      success: false,
      message: "no name specified, be sure to include name in request body"
    });
  } else {
    next();
  }
};

const validatePath = (req, res, next) => {
  if (!req.body.path || !utils.isValidPath(req.body.path)) {
    res.status(400);
    res.send({
      success: false,
      message:
        "given path is invalid or not specified, must start and end with '/'"
    });
  } else {
    next();
  }
};

export default {
  validateName,
  validatePath
};
