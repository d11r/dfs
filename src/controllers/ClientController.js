const pong = (req, res, next) => {
  res.send("pong");
  next();
};

export default { pong };
