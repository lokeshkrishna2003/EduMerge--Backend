require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes"); // Importing userRoutes
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
    const { username, email, password } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).send("Username already exists");
      }
      if (existingUser.email === email) {
        return res.status(400).send("Email already exists");
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with username, email, and hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", userId: savedUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while registering the user.");
  }
});

app.post("/login", async (req, res) => {
  try {
    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.username }],
    });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send("Invalid username or password");
    }

    res.status(200).json({ message: "User logged in successfully", userId: user._id });

  } catch (error) {
    res.status(500).send("An error occurred during login");
  }
});

app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
