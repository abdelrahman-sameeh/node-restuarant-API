const ApiError = require("../utils/ApiError");

exports.globalHandleError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev") {
    sendErrorToDeveloper(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorToProduction(err, res);
  }
};

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again...", 401);
const handleJwtExpired = () =>
  new ApiError("Expired token, please login again...", 401);

const sendErrorToDeveloper = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    ...err,
    stack: err.stack,
  });
};

const sendErrorToProduction = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    statusCode: err.statusCode,
  });
};
