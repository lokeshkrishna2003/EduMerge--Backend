require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json()); // Parse incoming JSON data
const port = process.env.PORT || 3001;
const mongoURI =
  "mongodb+srv://Lokesh:or7ckwnacl8AXwly@cluster0.buupryn.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello, EduMerge Studio Backend!");
});

app.post("/register", async (req, res) => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error(error); // Log the complete error
    res.status(500).send("An error occurred while registering the user.");
  }
});

app.post("/login", async (req, res) => {
  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Check the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    res.status(200).send("User logged in successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
