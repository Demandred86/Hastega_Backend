// using date-fns, uuid dependencies and fs from node

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// helper function -
// calling uuid creates a specific ID for each log item
//
const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    //create the directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// Actual middleware - req, res and ability to move to the next piece of middleware
const logger = (req, res, next) => {
  // TODO Implement conditional: handle origin of request
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, `reqLog.log`);
  console.log(`${req.method}\t${req.path}`);
  next();
};
module.exports = { logEvents, logger };
