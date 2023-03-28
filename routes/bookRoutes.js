const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController.js");

router
  .route("/")
  .get(bookController.getAllBooks)
  .post(bookController.createNewBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
