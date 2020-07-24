function errorHandler(err, req, res, next) {
  let statusCode = null;
  let errorMessage = "";
  let errorCode = "";

  switch (err.name) {
    case "forbidden":
      statusCode = 403;
      errorMessage = "invalid user or email";
      errorCode = err.name;
      break;
    case "token error":
      statusCode = 400;
      errorMessage = "token not found";
      errorCode = err.name;
      break;
    case "invalid user":
        statusCode = 404;
        errorMessage = "invalid user";
        errorCode = err.name
        break;
    default : 
        statusCode = 500;
        errorMessage = "internal server error";
        errorCode = "INTERNAL_ERROR"
  }

  res.status(statusCode).json({errorCode, message: errorMessage})
}

module.exports = errorHandler
