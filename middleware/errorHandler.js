const { logEvents } = require("./logger");

// Custom Middleware
// Overriding the default express error handler
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  // details about the error
  console.log(err.stack);

  //either return the status error or server error
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status);

  // response
  res.json({ message: err.message });
};

module.exports = errorHandler;
