const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  const defaultError = {
    statuseCode: err.statuseCode || 500,
    msg: err.message || "Something went wrong, Try again later",
  };

  if (err.name === "ValidationError") {
    defaultError.statuseCode = 400;
    // defaultError.msg = err.message;
    defaultError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.code && err.code === 11000) {
    defaultError.statuseCode = 400;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // res.status(defaultError.statuseCode).json({ msg: err });
  res.status(defaultError.statuseCode).json({ msg: defaultError.msg });
};

module.exports = errorHandlerMiddleware;
