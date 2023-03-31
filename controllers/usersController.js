const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
  // getting the data from the server, avoiding the password and calling the lean method in order to retrieve a JSON that does not include the methods.
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  //receiving data from the frontend
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  //confirm data
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All field are required" });
  }

  //check for duplicates
  const duplicates = await User.findOne({ email }).lean().exec();
  if (duplicates) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  //Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // # of salt rounds

  const userObject = { firstName, lastName, email, password: hashedPwd };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${email} created` });
  } else {
    res.status(400).json({ message: "invalid user data received" });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, firstName, lastName, email, password, book } = req.body;
  console.log(req.body);
  //confirm Data
  if (!id || !firstName || !lastName || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //Check that there are not Duplicate
  const duplicate = await User.findOne({ email }).lean().exec();

  //allow updates to the original user
  // if the id of the found duplicate is not equal to value of the id
  //contained in the request body, then return an error, because the email address already exists.
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  //Update the existing user with the new data
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.book = book;

  //The password gets updated only if a new password is available from the request body. Otherwise we would need to send it every time we wanted to update the data.
  if (password) {
    //HASH password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.email} updated` });
});

const deleteUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const result = await user.deleteOne();

  const reply = `User ${result.email} withID ${result.id} was deleted`;

  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
