const notFoundMiddleware = (req, res) =>
  res.status(404).send("Route dose not exist");

module.exports = notFoundMiddleware;
