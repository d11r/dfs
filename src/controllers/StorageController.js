const register = (req, res, next) => {
  // TODO: redirect to storage server
  res.send("todo: redirect to an appropriate storage server");
  next();
};

export default {
  register
};
