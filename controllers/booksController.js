const User = require("../models/User");
const Book = require("../models/Books");
const asyncHandler = require("express-async-handler");

const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().select().lean();
  if (!books?.length) {
    return res.status(400).json({ message: "No book found" });
  }
  res.json(books);
});

const createNewBook = asyncHandler(async (req, res) => {
  const {
    user: owner,
    title,
    isbn,
    addedDate,
    deletedDate,
    storyline,
    numberOfReadings,
  } = req.body;

  //confirm data
  if (!owner || !title) {
    return res.status(400).json({ message: "All field are required" });
  }
  if (!owner) {
    return res.status(400).json({ message: "owner required" });
  }
  if (!title) {
    return res.status(400).json({ message: "title required" });
  }
  if (!text.length) {
    return res.status(400).json({ message: "text required" });
  }

  const existsOwner = await User.findOne({ email: owner }).lean().exec();
  if (!existsOwner) {
    return res.status(400).json({ message: "This User does not exists" });
  }

  const userObject = {
    owner,
    title,
    isbn,
    text,
    addedDate,
    deletedDate,
    storyline,
    numberOfReadings,
  };

  // Create and store new user
  const book = await Book.create(userObject);

  if (book) {
    //created
    res.status(201).json({ message: "New book created" });
  } else {
    res.status(400).json({ message: "invalid book data received" });
  }
});

const updateBook = asyncHandler(async (req, res) => {
  const {
    id,
    user: owner,
    title,
    isbn,
    storyline,
    numberOfReadings,
  } = req.body;

  //confirm Data
  if (!id || !owner || !title.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const book = await Book.findById(id).exec();

  if (!book) {
    return res.status(400).json({ message: "Book not found" });
  }

  book.user = owner;
  book.title = title;
  book.isbn = isbn;
  book.storyline = storyline;

  const updatedBook = await book.save();
  res.json({
    message: `Book ${updatedBook.id} of ${updatedBook.user} was updated`,
  });
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(404).json({ message: "Book ID required" });
  }

  const book = await Books.findById(id).exec();

  if (!book) {
    return res.status(400).json({ message: "Book not found" });
  }
  const result = await Books.deleteOne();

  const reply = `Book ${result.id} of ${result.email} was deleted`;

  res.json(reply);
});

module.exports = {
  getAllBooks,
  createNewBook,
  updateBook,
  deleteBook,
};
