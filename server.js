// Allow use of environment variables
require("dotenv").config();

//Using Express
const express = require("express");
const app = express();

// Allows us to use app.use
const path = require("path");

// importing loggers and error handlers
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Makes us able to parse cookies
const cookieParser = require("cookie-parser");

// CORS
const cors = require("cors");
const corsOptions = require("./config/corsOptions");

// Database connection
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

//Define which port where we are running the server
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

// Calling the connection to the database function
connectDB();

// Logging the request errors
app.use(logger);

// makes our API available to the public | CORS policy|
// corsOptions defines the allowed origins
app.use(cors(corsOptions));

//builtin middleware - allows to process JSON in our application - Receive and parse JSON data
app.use(express.json());

// Third party middleware, Makes us able to parse cookies
app.use(cookieParser());

// Telling express where to find static files like css or images (using built-in middleware)
app.use("/", express.static(path.join(__dirname, "public")));

// Routing rules
app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes.js"));
app.use("/books", require("./routes/bookRoutes.js"));

// handling for everything else that has not been caught from the routes above
// handling html, JSON and anything else
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// Making use of the errorHandler | It should be near the bottom of the code, before we start listening
app.use(errorHandler);

//We wrap the app.listen within the listener for the mongoose connection | listening to the "open" event
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  // start to listen at "port"
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// populates the mongoDB connection error log
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
