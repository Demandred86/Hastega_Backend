const allowedOrigins = require("./allowedOrigins");

//
const corsOptions = {
  origin: (origin, callback) => {
    // "!origin" allows postman and other to access our rest API
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

module.exports = corsOptions;
