// Defining a router
const express = require("express");
const router = express.Router();
const path = require("path");

// Get request, using a regex pattern - Alkows requestes only if the first part matches "/" or "index" of index.html
router.get("^/$|/index(.html)?", (req, res) => {
  //sending the file back from view folder and html file | iew contains
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
